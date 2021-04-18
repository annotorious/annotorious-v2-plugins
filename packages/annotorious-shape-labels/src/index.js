import './index.css';

const ShapeLabelsFormatter = annotation => {

  const bodies = Array.isArray(annotation.body) ?
    annotation.body : [ annotation.body ];

  const firstTag = bodies.find(b => b.purpose == 'tagging');

  if (firstTag) {
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');

    // Fill annotation dimensions
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');

    foreignObject.innerHTML = `
      <div xmlns="http://www.w3.org/1999/xhtml" class="a9s-shape-label">
        ${firstTag.value}
      </div>`;

    return {
      element: foreignObject,
      className: firstTag.value
    };
  }
}


export default ShapeLabelsFormatter;