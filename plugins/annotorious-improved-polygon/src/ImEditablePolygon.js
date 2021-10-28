import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import { drawEmbeddedSVG } from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import { format, setFormatterElSize } from '@recogito/annotorious/src/util/Formatting';
import Mask from '@recogito/annotorious/src/tools/polygon/PolygonMask';

import { toSVGTarget } from './ImRubberbandPolygonTool';

const getPoints = shape =>
  Array.from(shape.querySelector('.a9s-inner').points);

const getBBox = shape =>
  shape.querySelector('.a9s-inner').getBBox();

export default class ImEditablePolygon extends EditableShape {

  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);

    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    // Container wraps the mask + editable shape
    this.container = document.createElementNS(SVG_NAMESPACE, 'g');

    // The editable shape group
    this.shape = drawEmbeddedSVG(annotation);
    this.shape.setAttribute('class', 'a9s-annotation editable selected');

    const innerPolygon = this.shape.querySelector('.a9s-inner');
    innerPolygon.addEventListener('mousedown', this.onGrab(this.shape));

    // Mask
    this.mask = new Mask(env.image, innerPolygon);

    this.container.appendChild(this.mask.element);
    this.container.appendChild(this.shape);

    const corners = getPoints(this.shape);

    // Corner handles
    this.cornerHandles = corners.map(pt => {
      const handle = this.drawHandle(pt.x, pt.y);
      handle.addEventListener('mousedown', this.onGrab(handle));

      this.shape.appendChild(handle);

      return handle;
    });

    // TODO midpoint handles

    g.appendChild(this.container);

    // Format needs to go after everything is added to the DOM
    format(this.shape, annotation, config.formatter);

    // Grabbed element and grab offset
    this.grabbedElement = null;
    this.grabbedAt = null;
  }

  destroy = () => {
    this.container.parentNode.removeChild(this.container);
    super.destroy();
  }

  get element() {
    return this.shape;
  }

  onGrab = element => evt => {
    if (evt.button !== 0) return;  // left click
    this.grabbedElement = element;
    this.grabbedAt = this.getSVGPoint(evt);
  }

  onMoveShape = pos => {
    const constrain = (coord, delta, max) =>
      coord + delta < 0 ? -coord : (coord + delta > max ? max - coord : delta);
  
    const { x, y, width, height } = getBBox(this.shape);
    const { naturalWidth, naturalHeight } = this.env.image;

    const dx = constrain(x, pos.x - this.grabbedAt.x, naturalWidth - width);
    const dy = constrain(y, pos.y - this.grabbedAt.y, naturalHeight - height);

    const updatedPoints = getPoints(this.shape).map(pt =>
      ({ x: pt.x + dx, y: pt.y + dy }));

    this.grabbedAt = pos;

    // Update shape
    this.setPoints(updatedPoints);
    
    // Update handles
    updatedPoints.forEach((pt, idx) => this.setHandleXY(this.cornerHandles[idx], pt.x, pt.y));
  }

  onMoveCornerHandle = pos => {
    const handleIdx = this.cornerHandles.indexOf(this.grabbedElement);

    const updatedPoints = getPoints(this.shape).map((pt, idx) =>
      (idx === handleIdx) ? pos : pt);

    this.setPoints(updatedPoints);
    this.setHandleXY(this.cornerHandles[handleIdx], pos.x, pos.y);
  }

  onMouseMove = evt => {
    if (this.grabbedElement) {
      const pos = this.getSVGPoint(evt);

      if (this.grabbedElement === this.shape) {
        this.onMoveShape(pos);
      } else {
        this.onMoveCornerHandle(pos);
      }

      const points = getPoints(this.shape).map(({x, y}) => [x, y]);
      this.emit('update', toSVGTarget(points, this.env.image));
    }
  }

  onMouseUp = evt => {
    this.grabbedElement = null;
    this.grabbedAt = null;
  }

  setPoints = points => {
    // Not using .toFixed(1) because that will ALWAYS
    // return one decimal, e.g. "15.0" (when we want "15")
    const round = num =>
      Math.round(10 * num) / 10;

    const str = points.map(pt => `${round(pt.x)},${round(pt.y)}`).join(' ');

    const inner = this.shape.querySelector('.a9s-inner');
    inner.setAttribute('points', str);

    const outer = this.shape.querySelector('.a9s-outer');
    outer.setAttribute('points', str);

    this.mask.redraw();

    const { x, y, width, height } = outer.getBBox();
    setFormatterElSize(this.shape, x, y, width, height);
  }

}