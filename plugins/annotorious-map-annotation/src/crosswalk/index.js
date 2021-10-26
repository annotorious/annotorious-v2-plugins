import { fragmentForward, fragmentReverse } from './fragment';
import { svgForward, svgReverse } from './svg';

// Shorthand
const merge = (annotation, selector) => ({
  ...annotation,
  target: {
    ...annotation.target,
    selector
  }
})

/** Crosswalks an annotation from lat/lon to map projection **/
export const forward = map => annotation => {

  // Spec allows array as well as object
  const selector = Array.isArray(annotation.target.selector) ? 
    annotation.target.selector[0] : annotation.target.selector;

  if (selector.type === 'FragmentSelector') {
    return merge(annotation, fragmentForward(selector, map));
  } else if (selector.type === 'SvgSelector') {
    return merge(annotation, svgForward(selector, map));
  } else {
    throw 'Unsupported selector type: ' + selector.type;
  }
  
}

/** Crosswalks an annotation from map projection to lat/lon **/
export const reverse = map => annotation => {

  const { selector } = annotation.target;

  if (selector.type === 'FragmentSelector') {
    return merge(annotation, fragmentReverse(selector, map));
  } else if (selector.type === 'SvgSelector') {
    return merge(annotation, svgReverse(selector, map));
  } else {
    throw 'Unsupported selector type: ' + selector.type;
  }

}