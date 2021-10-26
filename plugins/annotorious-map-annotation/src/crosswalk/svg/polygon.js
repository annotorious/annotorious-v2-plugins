const transform = (shape, fn) => {
  const points = shape.getAttribute('points')
    .split(' ')
    .map(t => t.split(',')
      .map(c => parseFloat(c.trim())));

  const transformed = points.map(orig => {
    const [ x, y ] = fn(orig);
    return x + ',' + y;
  }).join(' ');

  shape.setAttribute('points', transformed);
  return shape;
}

export const polygonForward = (shape, map) =>
  transform(shape, map.lonLatToImageCoordinates);

export const polygonReverse = (shape, map) =>
  transform(shape, map.imageToLonLat);