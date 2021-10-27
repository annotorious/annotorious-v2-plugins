import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import { Selection, ToolLike } from '@recogito/annotorious/src/tools/Tool';
import Mask from '@recogito/annotorious/src/tools/polygon/PolygonMask';

export const toSVGTarget = (selection, image) => {
  const polygon = selection.querySelector('.a9s-rubberband').cloneNode(true);
  polygon.removeAttribute('class');
  polygon.removeAttribute('xmlns');

  let serialized = polygon.outerHTML || new XMLSerializer().serializeToString(polygon);
  serialized = serialized.replace(` xmlns="${SVG_NAMESPACE}"`, '');

  return {
    source: image?.src,
    selector: {
      type: "SvgSelector",
      value: `<svg>${serialized}</svg>`
    }
  }
}

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
      const selection = new Selection(toSVGTarget(this.selection, this.env.image));
      this.emit('close', { shape: this.selection, selection });
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

  destroy = () => {
    this.container.parentNode.removeChild(this.container);
  }

  dragTo = xy => {
    // Make visible
    this.container.style.display = null;

    this.mousepos = xy;

    // Shape is points + mousepos
    this.setPoints([ ...this.points, xy ]);
    this.mask.redraw();

    if (this.isClosable())
      this.closeHandle.style.display = null;
    else 
      this.closeHandle.style.display = 'none';
  }

  get element() {
    return this.selection;
  }

  getBoundingClientRect = () =>
    this.rubberband.getBoundingClientRect();

  /**
   * Tests if the mouse is over the first point, meaning that
   * the polygon would be closed on click
   */ 
  isClosable = () => {
    if (this.points.length < 3)
      return; // Can't close unless at least 3 points

    const dx = Math.abs(this.mousepos[0] - this.points[0][0]);
    const dy = Math.abs(this.mousepos[1] - this.points[0][1]);

    const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    // Make closable if dist < 6 pix
    return dist < 6 * this.scale;
  }

  setPoints = arr => {
    const [head, ...tail] = arr;

    const path = 
      `M ${head[0]} ${head[1]} ` + 
      tail.map(([x,y]) => `L ${x} ${y}`).join(' ');

    this.outerPath.setAttribute('d', path);
    this.innerPath.setAttribute('d', path);

    const points = arr.map(t => `${t[0]},${t[1]}`).join(' ');
    this.rubberband.setAttribute('points', points);
  }

  setScale = scale => {
    this.scale = scale;
  }

}