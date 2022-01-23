import './index.css';

const getFirstText = annotation => {
  
}

export default anno => {

  let tooltip = null;

  const onMouseMove = evt => {
    tooltip.style.top = `${evt.clientY}px`;
    tooltip.style.left = `${evt.clientX}px`;
  }

  const showTooltip = (annotation, shape) => {
    // Create tooltip element
    tooltip = document.createElement('div');
    tooltip.setAttribute('class', 'a9s-hover-tooltip');

    // TODO get first TextualBody
    tooltip.innerHTML = 'Hello World!';

    anno._element.appendChild(tooltip);

    shape.addEventListener('mousemove', onMouseMove);
  }

  const hideTooltip = (annotation, shape) => {
    shape.removeEventListener('mousemove', onMouseMove);

    if (tooltip) {
      anno._element.removeChild(tooltip);
      tooltip = null;
    }
  }

  anno.on('mouseEnterAnnotation', (annotation, shape) =>
    showTooltip(annotation, shape));

  anno.on('mouseLeaveAnnotation', (annotation, shape) =>
    hideTooltip(annotation, shape));

}