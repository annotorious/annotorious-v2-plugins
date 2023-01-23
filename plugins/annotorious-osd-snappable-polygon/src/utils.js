import { 
  parseRectFragment,
  svgFragmentToShape,
} from '@recogito/annotorious/src/selectors';

export const getNearestSnappablePoint = (xy, annotations, threshold) => {

  const parsed = annotations.forEach(annotation => {
    const { selector } = annotation.target;

    if (selector.type === 'SvgSelector') { 
      const shape = svgFragmentToShape(annotation);
      const nodeName = shape.nodeName.toLowerCase();

      if (nodeName === 'polygon') {
        // TODO get points
        console.log('[TODO] parse points from polygon');
      }
    } else if (selector.type === 'FragmentSelector') {
      const { x, y, w, h } = parseRectFragment(annotation);

      console.log('got rectangle', x, y, w, h);

    } else {
      console.warn('Unsupported selector type: ' + selector.type);
    }
  });

  // TODO parse each anntotation

  // TODO extract point coordinates (for rect, polygon, tilted box, and point annotations)

  // TODO remove all points further away than 'threshold'

  // TODO sort by distance to XY and return first

}
