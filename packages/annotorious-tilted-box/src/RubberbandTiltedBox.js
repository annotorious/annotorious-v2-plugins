import Selection from '@recogito/recogito-client-core/src/Selection';

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
    
    this.baseline = document.createElementNS(SVG_NAMESPACE, 'line');
    this.baseline.setAttribute('style', 'stroke:red; stroke-width:3px;');
    this.baseline.setAttribute('x1', anchorX);
    this.baseline.setAttribute('y1', anchorY);
    this.baseline.setAttribute('x2', anchorX);
    this.baseline.setAttribute('y2', anchorY);

    this.tiltedbox = document.createElementNS(SVG_NAMESPACE, 'polygon');
    this.tiltedbox.setAttribute('style', 'stroke:blue; stroke-width:3px;');
    this.tiltedbox.setAttribute('points', `${anchorX}, ${anchorY} ${anchorX}, ${anchorY}`)

    // We make the selection transparent to 
    // pointer events because it would interfere with the 
    // rendered annotations' mouseleave/enter events
    this.group.style.pointerEvents = 'none';

    this.group.appendChild(this.tiltedbox);
    this.group.appendChild(this.baseline);

    g.appendChild(this.group);
  }

  get isCollapsed() {
    return this.shape.baseEnd == null;
  }

  render = () => {
    this.baseline.setAttribute('style', 'stroke:red; stroke-width:3px;');
    this.baseline.setAttribute('x1', this.shape.baseStart[0]);
    this.baseline.setAttribute('y1', this.shape.baseStart[1]);
    this.baseline.setAttribute('x2', this.shape.baseEnd[0]);
    this.baseline.setAttribute('y2', this.shape.baseEnd[1]);

    if (this.shape.opposite) {
      const points = [
        this.shape.baseStart,
        this.shape.baseEnd,
        this.shape.opposite 
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
      this.updateShape({ opposite: [ x, y ] });
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

  }

}