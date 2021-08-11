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

export const createBaseline = (optA, optB) => {
  const g = createElement('line');
  g.setAttribute('class', 'a9s-tilted-box-baseline');

  if (optA && optB) 
    setBaseline(g, optA, optB);

  return g;
}

export const createBox = optPoints => {
  const g = createElement('polygon');
  
  if (optPoints)
    setBoxPoints(g, optPoints);

  return g;
}

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

export const setBoxPoints = (g, points) => {
  const attr = points.map(xy => xy.join(',')).join(' ');

  const inner = g.querySelector('.a9s-inner');
  inner.setAttribute('points', attr);

  const outer = g.querySelector('.a9s-outer');
  outer.setAttribute('points', attr);
}

export const getBoxPoints = g =>
  g.querySelector('.a9s-inner').getAttribute('points')
    .split(' ')
    .map(t => t.split(',').map(num => parseFloat(num)));

export const createMinorHandle = (xy, handleRadius) => {
  // Make this 80% smaller than the configured handle radius
  const radius = Math.round((handleRadius || 6) * 0.8);

  const c = document.createElementNS(SVG_NAMESPACE, 'circle');
  c.setAttribute('class', 'a9s-minor-handle');
  c.setAttribute('cx', xy[0]);
  c.setAttribute('cy', xy[1]);
  c.setAttribute('r', radius);
  return c;
}