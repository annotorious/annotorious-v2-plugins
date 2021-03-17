import { Selection } from '@recogito/annotorious/src/tools/Tool';
import * as Geom2D from './Geom2D';

// TODO move into tool base class?
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export default class TiltedBox {

  constructor(points) {
    this.points = points;

    const [ a, b, ..._ ] = points;

    this.element = document.createElementNS(SVG_NAMESPACE, 'g');
    this.element.setAttribute('class', 'tilted-box');
    
    this.baseline = document.createElementNS(SVG_NAMESPACE, 'line');
    this.tiltedbox = document.createElementNS(SVG_NAMESPACE, 'polygon');
    this.pivot = document.createElementNS(SVG_NAMESPACE, 'circle');

    this.setPoints(points);

    // We make the selection transparent to 
    // pointer events because it would interfere with the 
    // rendered annotations' mouseleave/enter events
    this.element.style.pointerEvents = 'none';

    this.element.appendChild(this.tiltedbox);
    this.element.appendChild(this.baseline);
    this.element.appendChild(this.pivot);
  }

  get isCollapsed() {
    // TODO
    return false;
  }

  setPoints = points => {
    this.points = points; 

    const [ a, b, ..._ ] = points;

    this.baseline.setAttribute('x1', a[0]);
    this.baseline.setAttribute('y1', a[1]);
    this.baseline.setAttribute('x2', b[0]);
    this.baseline.setAttribute('y2', b[1]);

    const attr = points.map(xy => xy.join(', ')).join(' ');
    this.tiltedbox.setAttribute('points', attr);

    this.pivot.setAttribute('cx', a[0]);
    this.pivot.setAttribute('cy', a[1]);
    this.pivot.setAttribute('r', 6);
  } 
  
  setBaseEnd = (x, y) => {
    const a = this.points[0];
    const b = [ x, y ];
    
    // Box height
    const h = Geom2D.len(this.points[2], this.points[1]);

    if (h == 0) {
      this.setPoints([ a, b, b, a ]);
    } else {
      // TODO
      // Baseline normal (len = 1)
      // const baseline = Geom2D.vec(b, a);
      // const normal = Geom2D.normalize([ - baseline[1], baseline[0] ]);
    }
  }

  extrude = (pointerX, pointerY) => {
    const [ a, b, ..._] = this.points;

    // Baseline normal (len = 1)
    const baseline = Geom2D.vec(b, a);
    const normal = Geom2D.normalize([ - baseline[1], baseline[0] ]);

    // Vector baseline end -> mouse
    const toMouse = Geom2D.vec([ pointerX, pointerY ], b);

    // Projection of toMouse onto normal
    const f = [
      normal[0] * Geom2D.len(toMouse) * Math.cos(Geom2D.angleBetween(normal, Geom2D.normalize(toMouse))),
      normal[1] * Geom2D.len(toMouse) * Math.cos(Geom2D.angleBetween(normal, Geom2D.normalize(toMouse)))
    ];

    const c = Geom2D.add(b, f);
    const d = Geom2D.add(a, f);

    this.setPoints([ a, b, c, d ]);
  }

  toSelection = source => new Selection({ 
    source,
    selector: {
      type: 'SvgSelector',
      value: `<svg><polygon points="${this.tiltedbox.getAttribute('points')}" /></svg>`,
    },
    renderedVia: {
      name: 'annotorious-tilted-box'
    }
  });

  destroy = () => {
    // this.element.parentNode.removeChild(this.element);
  }

}