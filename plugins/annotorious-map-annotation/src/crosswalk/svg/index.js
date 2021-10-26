import { ellipseForward, ellipseReverse } from './ellipse';
import { pathForward, pathReverse } from './path';
import { polygonForward, polygonReverse } from './polygon';

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const parseSVGFragment = selector => {
  const parser = new DOMParser();

  // Parse the XML document, assuming SVG
  const { value } = selector;
  const doc = parser.parseFromString(value, 'image/svg+xml');

  return doc.documentElement;
}

const serialize = doc =>
  new XMLSerializer().serializeToString(doc);  

export const svgForward = (selector, map) => {
  const doc = parseSVGFragment(selector);
  const shape = doc.firstChild;
  const nodeName = shape.nodeName.toLowerCase();

  let crosswalked = null;

  if (nodeName === 'polygon') {
    crosswalked = polygonForward(shape, map);
  } else if (nodeName === 'ellipse') {
    crosswalked = ellipseForward(shape, map);
  } else if (nodeName === 'path') {
    crosswalked = pathForward(shape, map);
  } else {
    throw 'Forward crosswalk: unsupported shape type ' + nodeName;
  }

  doc.replaceChild(shape, crosswalked);

  return {
    type: 'SvgSelector',
    value: serialize(doc)
  };
}

export const svgReverse = (selector, map) => {
  const doc = parseSVGFragment(selector);
  const shape = doc.firstChild;
  const nodeName = shape.nodeName.toLowerCase();

  let crosswalked = null;

  if (nodeName === 'polygon') {
    crosswalked = polygonReverse(shape, map);
  } else if (nodeName === 'ellipse') {
    crosswalked = ellipseReverse(shape, map);
  } else if (nodeName === 'path') {
    crosswalked = pathReverse(shape, map);
  } else {
    throw 'Reverse crosswalk: unsupported SVG shape type ' + nodeName;
  }

  doc.replaceChild(shape, crosswalked);
  
  return {
    type: 'SvgSelector',
    value: serialize(doc)
  };
}