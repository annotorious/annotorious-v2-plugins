import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';

/** Common to all SVG shapes: draw group with inner + outer **/
const createElement = elem => {
  const g = document.createElementNS(SVG_NAMESPACE, 'g');

  const outer = document.createElementNS(SVG_NAMESPACE, elem);
  outer.setAttribute('class', 'a9s-outer');

  const inner =  document.createElementNS(SVG_NAMESPACE, elem);
  inner.setAttribute('class', 'a9s-inner');

  g.appendChild(outer);
  g.appendChild(inner);

  return g;
}

export const createBaseline = () => createElement('line');

export const createBox = () => createElement('polygon');

export const setBaseline = (g, from, to) => {

  const setCoords = line => {
    line.setAttribute('x1', from[0]);
    line.setAttribute('y1', from[1]);
    line.setAttribute('x2', to[0]);
    line.setAttribute('y2', to[1]);  
  }

  const inner = g.querySelector('.a9s-inner');
  setCoords(inner);

  const outer = g.querySelector('.a9s-outer');
  setCoords(outer);
}

export const setBox = (g, points) => {
  const attr = points.map(xy => xy.join(',')).join(' ');

  const inner = g.querySelector('.a9s-inner');
  inner.setAttribute('points', attr);

  const outer = g.querySelector('.a9s-outer');
  outer.setAttribute('points', attr);
}

export const getBoxPoints = g =>
  g.querySelector('.a9s-inner').getAttribute('points');
