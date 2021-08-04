import axios from 'axios';
import { rectFragmentToLegacy, legacyRectToSelector } from './FragmentSelector';
import { svgPolygonToLegacy, legacyPolygonToSelector } from './SvgSelector';

/** 
 * Legacy Recogito has a "W3C WebAnno-like", but proprietary, annotation
 * format. This function performs the crosswalk from WebAnno to legacy format.
 */
const toLegacyAnnotation = (webanno, config, keepId) => {

  const toLegacyBody = body => {
    let type = null;
    let value = null;

    switch(body.purpose) {
      case 'tagging':
        type = 'TAG';
        value = body.value;
        break;
      
      case 'classifying':
        type = body.value;
        break;

      case 'transcribing':
        type = 'TRANSCRIPTION';
        value = body.value;
        break;

      case 'grouping':
        type = 'GROUPING';
        value = body.value;
              
      case 'commenting':
        type = 'COMMENT';
        value = body.value;
        break;

      case 'replying':
        type = 'COMMENT';
        value = body.value;
        break;  
    }

    if (type === null) 
      throw new Error(`Unsupported body type: ${body.type}`);

    return { 
      type, 
      value, 
      last_modified_by: body.creator?.id
    };
  }

  const { selector } = webanno.target;

  let anchor;

  if (selector.value.startsWith('xywh=pixel:')) {
    anchor = rectFragmentToLegacy(selector);
  } else if (selector.value.startsWith('<svg>')) {
    anchor = svgPolygonToLegacy(selector);
  } else {
    throw "Unsupported selector: " + selector.value;
  }

  const legacy = {
    annotates: {
      document_id: config.documentId,
      filepart_id: config.partId,
      content_type: config.contentType
    },
    anchor, 
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

  const toWebAnnoBody = body => {
    let purpose = null;
    let value = null;
    
    if (body.type === 'TAG') {
      purpose = 'tagging';
      value = body.value;
    } else if (body.type === 'ENTITY' || body.type === 'LABEL' || body.type === 'SYMBOL') {
      purpose = 'classifying';
      value = body.type;
    } else if (body.type === 'TRANSCRIPTION') {
      purpose = 'transcribing';
      value = body.value;
    } else if (body.type === 'COMMENT') {
      purpose = 'commenting';
      value = body.value;
    } else {
      throw new Error(`Body type ${body.type} not supported`); 
    }

    return {
      type: 'TextualBody',
      purpose,
      value,
      creator: {
        id: body.last_modified_by
      },
      created: body.last_modified_at
    };
  };

  let selector = null;

  if (legacy.anchor.startsWith('rect:x=')) {
    selector = legacyRectToSelector(legacy.anchor);
  } else if (legacy.anchor.startsWith('svg.polygon:')) {
    selector = legacyPolygonToSelector(legacy.anchor);
  } else {
    throw "Unsupported anchor type: " + legacy.anchor;
  }

  return { 
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: legacy.annotation_id,
    type: 'Annotation',
    body: legacy.bodies.map(toWebAnnoBody),
    target: {
      selector
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