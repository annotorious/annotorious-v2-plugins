import Selection from '@recogito/recogito-client-core/src/Selection';

// TODO move into tool base class?
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * A 'rubberband' selection tool for creating a rectangle by
 * clicking and dragging.
 */
export default class RubberbandRect {

  constructor(anchorX, anchorY, g, env) {
    this.anchor = [ anchorX, anchorY ];
    this.opposite = [ anchorX, anchorY ];

    this.env = env;

    this.group = document.createElementNS(SVG_NAMESPACE, 'g');
    
    this.baseline = document.createElementNS(SVG_NAMESPACE, 'line');
    this.baseline.setAttribute('style', 'stroke:red; stroke-width:3px;');
    this.baseline.setAttribute('x1', anchorX);
    this.baseline.setAttribute('y1', anchorY);
    this.baseline.setAttribute('x2', anchorX + 2);
    this.baseline.setAttribute('y2', anchorX + 2);

    // We make the selection transparent to 
    // pointer events because it would interfere with the 
    // rendered annotations' mouseleave/enter events
    this.group.style.pointerEvents = 'none';

    // Additionally, selection remains hidden until 
    // the user actually moves the mouse
    this.group.style.display = 'none';

    this.group.appendChild(this.baseline);

    g.appendChild(this.group);
  }

  dragTo = (oppositeX, oppositeY) => {
    // Make visible
    this.group.style.display = null;

    this.opposite = [ oppositeX, oppositeY ];

    this.baseline.setAttribute('x2', oppositeX);
    this.baseline.setAttribute('y2', oppositeY);
  }

  toSelection = () => {
    const { x, y, w, h } = this.bbox;
    return new Selection({});
  }

  destroy = () => {

  }

}