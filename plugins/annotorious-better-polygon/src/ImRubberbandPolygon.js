import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import { Selection, ToolLike } from '@recogito/annotorious/src/tools/Tool';
import Mask from '@recogito/annotorious/src/tools/polygon/PolygonMask';

import { toSVGTarget } from './ImRubberbandPolygonTool';

export default class ImRubberbandPolygon extends ToolLike {

  constructor(anchor, g, config, env) {
    super(g, config, env);

    // Needed later to construct the Selection
    this.env = env;

    // UI scale
    this.scale = 1;

    // Polygon state
    this.points = [ anchor ];

    // Mouse state
    this.mousepos = anchor;

    // SVG geometry
    this.container = document.createElementNS(SVG_NAMESPACE, 'g');

    // The selection consisting of an (inner and outer) path, and 
    // the 'rubberband' polygon
    this.selection = document.createElementNS(SVG_NAMESPACE, 'g');
    this.selection.setAttribute('class', 'a9s-selection improved-polygon');

    this.outerPath = document.createElementNS(SVG_NAMESPACE, 'path');
    this.outerPath.setAttribute('class', 'a9s-outer'); 

    this.innerPath = document.createElementNS(SVG_NAMESPACE, 'path');
    this.innerPath.setAttribute('class', 'a9s-inner'); 

    this.rubberband = document.createElementNS(SVG_NAMESPACE, 'polygon');
    this.rubberband.setAttribute('class', 'a9s-rubberband');

    this.closeHandle = this.drawHandle(anchor[0], anchor[1]);
    this.closeHandle.style.display = 'none';

    this.setPoints(this.points);

    this.selection.appendChild(this.rubberband)
    this.selection.appendChild(this.outerPath);
    this.selection.appendChild(this.innerPath);
    this.selection.appendChild(this.closeHandle);

    this.mask = new Mask(env.image, this.rubberband);

    // Hide until user actually moves the mouse
    this.container.style.display = 'none';

    this.container.appendChild(this.mask.element);
    this.container.appendChild(this.selection);

    g.appendChild(this.container);
  }

  addPoint = () => {
    if (this.isClosable()) {
      // Close, don't add
      this.close();
    } else {
      // Don't add a new point if distance < 2 pixels
      const [x, y] = this.mousepos;
      const lastCorner = this.points[this.points.length - 1];
      const dist = Math.pow(x - lastCorner[0], 2) + Math.pow(y - lastCorner[1], 2);
      
      if (dist > 4) {
        this.points = [...this.points, this.mousepos];
        this.setPoints(this.points);   
        this.mask.redraw();
      }
    }
  }

  close = () => {
    const selection = new Selection(toSVGTarget(this.points, this.env.image));
    this.emit('close', { shape: this.selection, selection });
  }

  destroy = () => {
    this.container.parentNode.removeChild(this.container);
  }

  dragTo = xy => {
    // Make visible
    this.container.style.display = null;

    this.mousepos = xy;

    const d = this.getDistanceToStart();

    // Display close handle if distance < 40px
    if (d < 40) {
      this.closeHandle.style.display = null;
    } else { 
      this.closeHandle.style.display = 'none';
    }

    // Snap if nearby
    if (d < 20) {
      this.mousepos = this.points[0];
    }

    // Shape is points + (snapped) mousepos
    this.setPoints([ ...this.points, this.mousepos ]);
    this.mask.redraw();
  }

  get element() {
    return this.selection;
  }

  getBoundingClientRect = () =>
    this.rubberband.getBoundingClientRect();

  getDistanceToStart = () => {
    if (this.points.length < 3)
      return Infinity; // Just return if not at least 3 points

    const dx = Math.abs(this.mousepos[0] - this.points[0][0]);
    const dy = Math.abs(this.mousepos[1] - this.points[0][1]);

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) / this.scale;
  }
  
  /**
   * Tests if the mouse is over the first point, meaning that
   * the polygon would be closed on click
   */ 
  isClosable = () => {
    const d = this.getDistanceToStart();
    return d < 6 * this.scale;
  }

  onScaleChanged = scale => {
    this.scale = scale;

    const inner = this.closeHandle.querySelector('.a9s-handle-inner');
    const outer = this.closeHandle.querySelector('.a9s-handle-outer');

    const radius = scale * (this.config.handleRadius || 6);

    inner.setAttribute('r', radius);
    outer.setAttribute('r', radius);
  }

  /** Removes last corner **/
  pop = () => {
    this.points.pop();
    this.setPoints(this.points);
    this.mask.redraw();
  }

  setPoints = arr => {
    const [head, ...tail]= arr;

    const path = 
      `M ${head[0]} ${head[1]} ` + 
      tail.map(([x,y]) => `L ${x} ${y}`).join(' ');

    this.outerPath.setAttribute('d', path);
    this.innerPath.setAttribute('d', path);

    const points = arr.map(t => `${t[0]},${t[1]}`).join(' ');
    this.rubberband.setAttribute('points', points);
  }

}