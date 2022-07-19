const parseRectFragment = selector => {
  const { value } = selector;
  const coords = value.includes(':') ? value.substring(value.indexOf(':') + 1) : value.substring(value.indexOf('=') + 1);

  const [ x, y, w, h ] = coords.split(',').map(parseFloat);

  return { x, y, w, h };
}

const transform = (selector, fn) => {
  const { x, y, w, h } = parseRectFragment(selector);

  const mapTopLeft = [x, y];
  const mapBottomRight = [x + w, y + h];

  const llTopLeft = fn(mapTopLeft);
  const llBottomRight = fn(mapBottomRight);

  const width = llBottomRight[0] - llTopLeft[0];
  const height = llTopLeft[1] - llBottomRight[1];

  return {
    type: "FragmentSelector",
    conformsTo: "http://www.w3.org/TR/media-frags/",
    value: `xywh=${llTopLeft[0]},${llTopLeft[1]},${width},${height}`
  };
}

export const fragmentForward = (selector, map) =>
  transform(selector, map.lonLatToImage);

/**
 * Converts the fragment from native map coordinates to lon/lat.
 */
export const fragmentReverse = (selector, map) =>
  transform(selector, map.imageToLonLat);
