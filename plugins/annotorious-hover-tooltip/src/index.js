import './index.css';

const getFirstTextBody = annotation => {
  if (!annotation.body)
    return;

  const bodies = Array.isArray(annotation.body) ? 
    annotation.body : [ annotation.body ];

  return bodies.find(b => b.type === 'TextualBody');
}

export default anno => {

  let tooltip = null;

  const onMouseMove = evt => {
    tooltip.style.top = `${evt.offsetY}px`;
    tooltip.style.left = `${evt.offsetX}px`;
  }

  const showTooltip = (annotation, shape) => {
    const body = getFirstTextBody(annotation);

    if (body) {
      // Create tooltip element
      tooltip = document.createElement('div');
      tooltip.setAttribute('class', 'a9s-hover-tooltip');

      // TODO get first TextualBody
      tooltip.innerHTML = body.value;

      anno._element.appendChild(tooltip);

      shape.addEventListener('mousemove', onMouseMove);
    }
  }

  const hideTooltip = shape => {
    shape.removeEventListener('mousemove', onMouseMove);

    if (tooltip) {
      anno._element.removeChild(tooltip);
      tooltip = null;
    }
  }

  anno.on('mouseEnterAnnotation', (annotation, shape) =>
    showTooltip(annotation, shape));

  anno.on('mouseLeaveAnnotation', (_, shape) =>
    hideTooltip(shape));

}