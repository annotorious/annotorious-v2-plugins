import { 
  parseRectFragment,
  svgFragmentToShape,
} from '@recogito/annotorious/src/selectors';

const dist = (a, b) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  
  return Math.sqrt(dx * dx + dy * dy);
}

export const getNearestSnappablePoint = (origin, annotations, threshold) => {

  // Parse annotations and extract corner points
  const points = annotations.reduce((all, annotation) => {
    const { selector } = annotation.target;

    if (selector.type === 'SvgSelector') { 
      const shape = svgFragmentToShape(annotation);
      const nodeName = shape.nodeName.toLowerCase();

      if (nodeName === 'polygon') {
        const points = shape.getAttribute('points')
          .split(' ')
          .map(xy => xy.split(',').map(d => parseFloat(d.trim())));

        return [...all, ...points ];
      } else {
        return all;
      }
    } else if (selector.type === 'FragmentSelector') {
      const { x, y, w, h } = parseRectFragment(annotation);

      const points = (w + h) > 0 ? [ 
        [ x, y ],
        [ x + w, y ],
        [ x + w, y + h ],
        [ x, y + h ]
      ] : [
        [ x, y]
      ];

      return [...all, ...points ];
    } else {
      console.warn('Unsupported selector type: ' + selector.type);
      return all;
    }
  }, []);

  // Remove all points further away than 'threshold'
  const nearbyPoints = points.filter(xy => dist(origin, xy) <= threshold);

  // Sort by distance
  nearbyPoints.sort((a, b) => dist(origin, a) - dist(origin, b));

  return nearbyPoints.length === 0 ? null : nearbyPoints[0];

}
