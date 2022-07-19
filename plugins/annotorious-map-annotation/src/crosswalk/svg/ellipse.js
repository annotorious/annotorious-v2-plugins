const transform = (shape, fn) => { 
  // Shorthand
  const attr = name =>
    parseFloat(shape.getAttribute(name));

  const cx = attr('cx');
  const cy = attr('cy');
  const rx = attr('rx');
  const ry = attr('ry');

  const center = fn([cx, cy]);
  const top = fn([cx, cy - ry]);
  const left = fn([cx - rx, cy]);
   
  shape.setAttribute('cx', center[0]);
  shape.setAttribute('cy', center[1]);
  shape.setAttribute('rx', center[0] - left[0]);
  shape.setAttribute('ry', top[1] - center[1]);
  return shape;
}

export const ellipseForward = (shape, map) =>
  transform(shape, map.lonLatToImage);

export const ellipseReverse = (shape, map) =>
  transform(shape, map.imageToLonLat);