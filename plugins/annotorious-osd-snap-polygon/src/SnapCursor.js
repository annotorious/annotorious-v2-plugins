import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';

const CIRCLE_RADIUS = 6;

const INDICATOR_RADIUS = 12;

export const drawCursor = (xy, scale = 1) => {
  const [x, y] = xy;

  const containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');
  containerGroup.setAttribute('class', 'a9s-snap-cursor');

  const drawCircle = r => {
    const c = document.createElementNS(SVG_NAMESPACE, 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', r * scale);
    c.setAttribute('transform-origin', `${x} ${y}`);
    return c;
  }

  const inner = drawCircle(CIRCLE_RADIUS);
  inner.setAttribute('class', 'a9s-snap-cursor-inner')

  const outer = drawCircle(INDICATOR_RADIUS);
  outer.setAttribute('class', 'a9s-snap-cursor-outer')

  containerGroup.appendChild(outer);
  containerGroup.appendChild(inner);
  return containerGroup;
}

export const setCursorXY = (cursor, xy) => {
  const [x, y] = xy;

  const inner = cursor.querySelector('.a9s-snap-cursor-inner');
  inner.setAttribute('cx', x);
  inner.setAttribute('cy', y);
  inner.setAttribute('transform-origin', `${x} ${y}`);

  const outer = cursor.querySelector('.a9s-snap-cursor-outer');
  outer.setAttribute('cx', x);
  outer.setAttribute('cy', y);
  outer.setAttribute('transform-origin', `${x} ${y}`);
}

export const setSnapEnabled = (cursor, enabled) => {
  if (enabled)
    cursor.setAttribute('class', 'a9s-snap-cursor active');
  else
    cursor.setAttribute('class', 'a9s-snap-cursor');
}

export const scaleCursor = (cursor, scale) => {
  const inner = cursor.querySelector('.a9s-snap-cursor-inner');
  const outer = cursor.querySelector('.a9s-snap-cursor-outer');

  inner.setAttribute('r', scale * CIRCLE_RADIUS);
  outer.setAttribute('r', scale * INDICATOR_RADIUS);
}