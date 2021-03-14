import * as Geom2D from './Geom2D';

// TODO move into tool base class?
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * A 'rubberband' selection tool for creating a rectangle by
 * clicking and dragging.
 */
export default class RubberbandTiltedBox {

  constructor(anchorX, anchorY, g, env) {
    this.env = env;

    this.drawingState = 'BASELINE'; // or 'EXTRUDE'

    // The shape is defined by three points: 
    // i) anchor/pivot point at baseline start,
    // ii) the baseline end
    // iii) the opposite point, above baseline
    this.shape = {
      baseStart:[ anchorX, anchorY ],
      baseEnd: null,
      opposite: null
    }

    this.group = document.createElementNS(SVG_NAMESPACE, 'g');
    this.group.setAttribute('class', 'a9s-selection tilted-box');
    
    this.baseline = document.createElementNS(SVG_NAMESPACE, 'line');
    this.baseline.setAttribute('x1', anchorX);
    this.baseline.setAttribute('y1', anchorY);
    this.baseline.setAttribute('x2', anchorX);
    this.baseline.setAttribute('y2', anchorY);

    this.tiltedbox = document.createElementNS(SVG_NAMESPACE, 'polygon');
    this.tiltedbox.setAttribute('points', `${anchorX}, ${anchorY} ${anchorX}, ${anchorY}`)

    this.pivot = document.createElementNS(SVG_NAMESPACE, 'circle');
    this.pivot.setAttribute('cx', anchorX);
    this.pivot.setAttribute('cy', anchorY);
    this.pivot.setAttribute('r', 6);

    // We make the selection transparent to 
    // pointer events because it would interfere with the 
    // rendered annotations' mouseleave/enter events
    this.group.style.pointerEvents = 'none';

    this.group.appendChild(this.tiltedbox);
    this.group.appendChild(this.baseline);
    this.group.appendChild(this.pivot);

    g.appendChild(this.group);
  }

  get isCollapsed() {
    return this.shape.baseEnd == null;
  }

  get isComplete() {
    return this.shape.opposite != null;
  }

  getFloatingOpposite = (pointerX, pointerY) => {
    // Baseline normal (len = 1)
    const baseline = Geom2D.vec(this.shape.baseEnd, this.shape.baseStart);
    const normal = Geom2D.normalize([ - baseline[1], baseline[0] ]);

    // Vector baseline end -> mouse
    const toMouse = Geom2D.vec([ pointerX, pointerY ], this.shape.baseEnd);

    // Projection of toMouse onto normal
    const f = [
      normal[0] * Geom2D.len(toMouse) * Math.cos(Geom2D.angleBetween(normal, Geom2D.normalize(toMouse))),
      normal[1] * Geom2D.len(toMouse) * Math.cos(Geom2D.angleBetween(normal, Geom2D.normalize(toMouse)))
    ];

    return Geom2D.add(this.shape.baseEnd, f);
  }

  render = () => {
    this.baseline.setAttribute('x1', this.shape.baseStart[0]);
    this.baseline.setAttribute('y1', this.shape.baseStart[1]);
    this.baseline.setAttribute('x2', this.shape.baseEnd[0]);
    this.baseline.setAttribute('y2', this.shape.baseEnd[1]);

    if (this.shape.opposite) {
      const height = Geom2D.vec(this.shape.opposite, this.shape.baseEnd);

      const points = [
        this.shape.baseStart,
        this.shape.baseEnd,
        this.shape.opposite,
        Geom2D.add(this.shape.baseStart, height)
      ].map(xy => xy.join(', '));

      this.tiltedbox.setAttribute('points', points.join(' '));
    }
  }

  updateShape = diff => {
    this.shape = { ...this.shape, ...diff };
    this.render();
  }

  onMouseMove = (x, y) => {
    if (this.drawingState === 'BASELINE') {
      this.updateShape({ baseEnd: [ x, y ] });
    } else if (this.drawingState === 'EXTRUDE') {
      this.updateShape({ opposite: this.getFloatingOpposite(x, y) });
    }
  }

  onMouseUp = (x, y) => {
    if (this.drawingState === 'BASELINE') {
      this.drawingState = 'EXTRUDE'
    }
  }

  toSelection = () => {

  }

  destroy = () => {
    // Just a hack
    this.drawingState = false;
  }

}