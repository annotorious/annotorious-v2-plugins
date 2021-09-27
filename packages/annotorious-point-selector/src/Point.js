import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';

const setXY = (shape, x, y) => {  
  shape.setAttribute('cx', x);
  shape.setAttribute('cy', y);
  shape.setAttribute('r', 6);
}

export const drawPoint = (x, y) => {
  const g = document.createElementNS(SVG_NAMESPACE, 'g');

  const outerPoint  = document.createElementNS(SVG_NAMESPACE, 'circle');
  const innerPoint  = document.createElementNS(SVG_NAMESPACE, 'circle');

  outerPoint.setAttribute('class', 'a9s-outer');
  outerPoint.style.cursor = 'none';
  setXY(outerPoint, x, y);

  innerPoint.setAttribute('class', 'a9s-inner');
  innerPoint.style.cursor = 'none';
  setXY(innerPoint, x, y);

  g.appendChild(outerPoint);
  g.appendChild(innerPoint);

  return g;
} 

export const setPointXY = (g, x, y) => {
  const outerPoint = g.querySelector('.a9s-outer');
  setXY(outerPoint, x, y);

  const innerPoint = g.querySelector('.a9s-inner');
  setXY(innerPoint, x, y);
}

export const getPointXY = g => {
  const innerPoint = g.querySelector('.a9s-inner');
  
  const x = innerPoint.getAttribute('cx');
  const y = innerPoint.getAttribute('cy');

  return { x, y };
}