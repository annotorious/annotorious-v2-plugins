import { Selection, ToolLike } from '@recogito/annotorious/src/tools/Tool';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';

import * as Geom2D from './Geom2D';
import { 
  createBaseline, 
  createBox,
  setBaseline,
  setBoxPoints
} from './TiltedBox';

const polygonBounds = points => {
  return { w: 100, h: 100 };
}

export default class TiltedBox extends ToolLike {

  constructor(points, g, config, env) {
    super(g, config, env);

    this.points = points;

    const [ a, b, ..._ ] = points;

    this.group = document.createElementNS(SVG_NAMESPACE, 'g');

    this.element = document.createElementNS(SVG_NAMESPACE, 'g');
    this.element.setAttribute('class', 'a9s-selection tilted-box');
    
    this.baseline = createBaseline();
    this.tiltedbox = createBox();

    this.pivot = this.drawHandle(0, 0);

    this.setPoints(points);

    // We make the selection transparent to 
    // pointer events because it would interfere with the 
    // rendered annotations' mouseleave/enter events
    this.element.style.pointerEvents = 'none';

    this.element.appendChild(this.tiltedbox);
    this.element.appendChild(this.baseline);
    this.element.appendChild(this.pivot);

    this.group.appendChild(this.element);

    g.appendChild(this.group);
  }
  
  scalePivot = scale => {
    const inner = this.pivot.querySelector('.a9s-handle-inner');
    const outer = this.pivot.querySelector('.a9s-handle-outer');

    const radius = scale * (this.config.handleRadius || 6);

    inner.setAttribute('r', radius);
    outer.setAttribute('r', radius);
  }

  get isCollapsed() {
    const { w, h } = polygonBounds(this.points);
    return w * h < 9;
  }

  setPoints = points => {
    this.points = points; 

    const [ a, b, ..._ ] = points;

    setBaseline(this.baseline, a, b);
    setBoxPoints(this.tiltedbox, points);

    this.setHandleXY(this.pivot, a[0], a[1]);
  } 
  
  setBaseEnd = (x, y) => {
    const a = this.points[0];
    const b = [ x, y ];
    this.setPoints([ a, b, b, a ]);
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

  toSelection = source => {
    const points = this.tiltedbox.querySelector('.a9s-inner').getAttribute('points');
 
    return new Selection({ 
      source,
      selector: {
        type: 'SvgSelector',
        value: `<svg><polygon points="${points}" /></svg>`,
      },
      renderedVia: {
        name: 'annotorious-tilted-box'
      }
    });
  }

  destroy = () => {
    this.group.parentNode.removeChild(this.group);

    this.element = null;
    this.group = null;
  }

}