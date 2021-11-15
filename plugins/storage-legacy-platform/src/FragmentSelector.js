/**
 * Convert media fragment syntax (xywh=pixel:292,69,137,125) to 
 * proprietary Recogito rect syntax (rect:x=292,y=69,w=137,h=125)
 */
export const rectFragmentToLegacy = selector => {
  const [ _, coords ] = selector.value.includes(':') ? 
    selector.value.split(':') : selector.value.split('=');

  const [ x, y, w, h] = coords.split(',').map(parseFloat);

  return w > 0 && h > 0 ? 
    `rect:x=${x},y=${y},w=${w},h=${h}` :
    `point:${x},${y}`;
}

/**
 * Convert proprietary Recogito rect syntax to media fragment 
 */
export const legacyRectToSelector = anchor => {
  const [ _, tuples ] = anchor.split(':');
  const [ x, y, w, h ] = tuples.split(',').map(t => parseFloat(t.split('=')[1]))

  return {
    type: 'FragmentSelector',
    conformsTo: 'http://www.w3.org/TR/media-frags/',
    value: `xywh=pixel:${x},${y},${w},${h}`
  }
}

export const legacyPointToSelector = anchor => {
  const [ _, xy ] = anchor.split(':');
  const [ x, y ] = xy.split(',').map(t => parseFloat(t));

  return {
    type: 'FragmentSelector',
    conformsTo: 'http://www.w3.org/TR/media-frags/',
    value: `xywh=pixel:${x},${y},0,0`
  }}