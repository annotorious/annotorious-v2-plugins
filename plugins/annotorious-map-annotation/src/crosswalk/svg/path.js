const transform = (shape, fn) => {
  const commands = shape.getAttribute('d')
    .split(/(?=M|m|L|l|H|h|V|v|Z|z)/g)
    .map(str => str.trim());

  const transformed = commands.map(cmd => {
    const op = cmd.substring(0, 1);

    if (op.toLowerCase() === 'z') {
      return op;
    } else {
      const xy = cmd.substring(1).trim().split(' ')
        .map(str => parseFloat(str.trim()));

      const [tx, ty] = fn(xy);
      return op + ' ' + tx + ' ' + ty;
    }
  }).join(' ');

  shape.setAttribute('d', transformed);
  return shape;
}

export const pathForward = (shape, map) =>
  transform(shape, map.lonLatToImageCoordinates);

export const pathReverse = (shape, map) =>
  transform(shape, map.imageToLonLat);