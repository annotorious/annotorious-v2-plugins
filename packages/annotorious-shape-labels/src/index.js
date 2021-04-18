import WebAnnotation from '@recogito/recogito-client-core/src/WebAnnotation';

const ShapeLabelsFormatter = annotation => {
  const a = new WebAnnotation(annotation);
  const firstTag = a.bodies.find(b => b.purpose == 'tagging');

  if (firstTag) {
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');

    // Fill annotation dimensions
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');

    foreignObject.innerHTML = `
      <div xmlns="http://www.w3.org/1999/xhtml" class="a9s-shape-label">
        ${firstTag.value}
      </div>`;

    return foreignObject;
  }
}


export default ShapeLabelsFormatter;