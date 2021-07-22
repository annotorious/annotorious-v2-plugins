import axios from 'axios';

/** 
 * Legacy Recogito has a "W3C WebAnno-like", but proprietary, annotation
 * format. This function performs the crosswalk from WebAnno to legacy format.
 * 
 * TODO support text annotations
 */
const toLegacyAnnotation = (webanno, config, keepId) => {
  const fragment = webanno.target.selector.value;

  if (!fragment.startsWith('xywh=pixel:'))
    throw new Error('Recogito legacy storage supports rectangles only');

  // Convert media fragment syntax (xywh=pixel:292,69,137,125) to 
  // proprietary Recogito syntax (rect:x=292,y=69,w=137,h=125)
  const [ _, coords ] = fragment.split(':');
  const [ x, y, w, h] = coords.split(',').map(parseFloat);

  const toLegacyBody = body => {
    const type = body.type === 'TextualBody' ? 
      body.purpose === 'tagging' ? 'TAG' : 'COMMENT' :
      null;

    if (type === null) 
      throw new Error(`Unsupported body type: ${body.type}`);

    return { 
      type, 
      last_modified_by: body.creator.id, 
      value: body.value 
    };
  }

  const legacy = {
    annotates: {
      document_id: config.documentId,
      filepart_id: config.partId,
      content_type: config.contentType
    },
    anchor: `rect:x=${Math.round(x)},y=${Math.round(y)},w=${Math.round(w)},h=${Math.round(h)}`, 
    bodies: webanno.body.map(toLegacyBody)
  };

  // If this is an UPDATE, we need to keep the ID.
  // If it's a CREATE, we need to remove it - this is how
  // legacy Recogito tells these two operations apart.
  if (keepId)
    legacy.annotation_id = webanno.id;

  return legacy;
}

/** 
 * Vice versa, this function crosswalks from legacy to WebAnno.
 */
const fromLegacyAnnotation = legacy => {
  // Reminder: proprietary Recogito syntax is rect:x=292,y=69,w=137,h=125
  if (!legacy.anchor.startsWith('rect:x='))
    throw new Error('Recogito legacy storage supports rectangles only');
  
  const [ _, tuples ] = legacy.anchor.split(':');
  const [ x, y, w, h ] = tuples.split(',').map(t => parseFloat(t.split('=')[1]))

  const toWebAnnoBody = body => {
    let purpose = null;
    
    if (body.type === 'TAG')
      purpose = 'tagging';
    else if (body.type === 'COMMENT')
      purpose = 'commenting';
    else
      throw new Error(`Body type ${body.type} not supported`); 

    return {
      type: 'TextualBody',
      purpose,
      value: body.value,
      creator: {
        id: body.last_modified_by
      },
      created: body.last_modified_at
    };
  };

  return { 
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: legacy.annotation_id,
    type: 'Annotation',
    body: legacy.bodies.map(toWebAnnoBody),
    target: {
      selector: {
        type: 'FragmentSelector',
        conformsTo: 'http://www.w3.org/TR/media-frags/',
        value: `xywh=pixel:${x},${y},${w},${h}`
      }
    }
  }
}

const LegacyStoragePlugin = (client, config) => {
  // Fetch annotations
  const url = `/api/document/${config.documentId}/part/${config.partSequenceNo}/annotations`;

  axios.get(url).then(response => {
    const annotations = response.data.map(fromLegacyAnnotation);
    client.setAnnotations(annotations);
  });

  const onCreateAnnotation = (annotation, overrideId) => {
    axios.post('/api/annotation', toLegacyAnnotation(annotation, config)).then(response => {
      const { annotation_id } = response.data;
      overrideId(annotation_id);
    });
  }

  /** 
   * Note that legacy Recogito only has a single 'upsert' operation.
   * Therefore, updating works exactly like create. The only difference
   * is that we don't need ot update the ID.
   */
  const onUpdateAnnotation = annotation =>
    axios.post('/api/annotation', toLegacyAnnotation(annotation, config, true));

  const onDeleteAnnotation = annotation =>
    axios.delete(`/api/annotation/${annotation.id}`);

  // Attach lifecycle handlers
  client.on('createAnnotation', onCreateAnnotation);
  client.on('updateAnnotation', onUpdateAnnotation);
  client.on('deleteAnnotation', onDeleteAnnotation);

}

export default LegacyStoragePlugin;