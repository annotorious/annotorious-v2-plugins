import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { SVG_NAMESPACE, addClass, hasClass, removeClass } from '@recogito/annotorious/src/util/SVG';
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

    document.body.addEventListener('keydown', this.onKeyDown);

    // Container wraps the mask + editable shape
    this.container = document.createElementNS(SVG_NAMESPACE, 'g');

    // The editable shape group
    this.shape = drawEmbeddedSVG(annotation);
    this.shape.setAttribute('class', 'a9s-annotation editable selected improved-polygon');

    const innerPolygon = this.shape.querySelector('.a9s-inner');
    innerPolygon.addEventListener('mousedown', this.onGrab(this.shape));

    // Mask
    this.mask = new Mask(env.image, innerPolygon);

    this.container.appendChild(this.mask.element);
    this.container.appendChild(this.shape);

    const corners = getPoints(this.shape);

    // Corner handles
    this.cornerHandles = corners.map(this.createCornerHandle);

    // Midpoint handles
    this.midpoints = corners.map((_, idx) => this.createMidpoint(corners, idx));

    g.appendChild(this.container);

    // Format needs to go after everything is added to the DOM
    format(this.shape, annotation, config.formatter);

    // Grabbed element and grab offset
    this.grabbedElement = null;
    this.grabbedAt = null;

    // Selected corners
    this.selected = [];
  }

  createCornerHandle = pt => {
    const handle = this.drawHandle(pt.x, pt.y);
    handle.addEventListener('mousedown', this.onGrab(handle));
    handle.addEventListener('click', this.onSelectCorner(handle));

    this.shape.appendChild(handle);
    return handle;
  }

  createMidpoint = (corners, idx) => {
    // Create point between this and previous corner
    const thisCorner = corners[idx];
    const nextCorner = idx === corners.length - 1 ? corners[0] : corners[idx + 1];

    const x = (thisCorner.x + nextCorner.x) / 2;
    const y = (thisCorner.y + nextCorner.y) / 2;

    const handle = this.drawMidpoint(x, y);
    handle.addEventListener('mousedown', this.onGrab(handle));

    this.shape.appendChild(handle);
    return handle;
  }

  deleteSelected = () => {
    const points = getPoints(this.shape);
    
    if (this.selected.length > 0 && (points.length - this.selected.length > 2)) {
      const updatedPoints = points.filter((_, idx) => !this.selected.includes(idx));
      
      // Update corner handles
      const handlesToDelete = this.cornerHandles.filter((_, idx) => this.selected.includes(idx));
      handlesToDelete.forEach(h => h.parentNode.removeChild(h));

      this.cornerHandles = this.cornerHandles.filter((_, idx) => !this.selected.includes(idx));
      
      // Update midpoints
      const midpointsToDelete = this.midpoints.filter((_, idx) => this.selected.includes(idx));
      midpointsToDelete.forEach(m => m.parentNode.removeChild(m));

      this.midpoints = this.midpoints.filter((_, idx) => !this.selected.includes(idx));

      this.setPoints(updatedPoints);
    }
  }

  deselectCorners = () =>
    this.cornerHandles.forEach(h => removeClass(h, 'selected'));

  destroy = () => {
    this.container.parentNode.removeChild(this.container);

    this.svg.removeEventListener('mousemove', this.onMouseMove);
    this.svg.removeEventListener('mouseup', this.onMouseUp);

    document.body.removeEventListener('keydown', this.onKeyDown);

    super.destroy();
  }

  drawMidpoint = (x, y) => {
    const handle = document.createElementNS(SVG_NAMESPACE, 'circle');
    handle.setAttribute('class', 'a9s-midpoint');
    
    handle.setAttribute('cx', x);
    handle.setAttribute('cy', y);
    handle.setAttribute('r', 5);

    return handle;
  }

  get element() {
    return this.shape;
  }

  onAddPoint = pos => {
    const corners = getPoints(this.shape);

    const idx = this.midpoints.indexOf(this.grabbedElement) + 1;

    // Updated polygon points
    const updatedCorners = [
      ...corners.slice(0, idx),
      pos,
      ...corners.slice(idx)
    ];

    // New corner handle
    const cornerHandle = this.createCornerHandle(pos);
    this.cornerHandles = [
      ...this.cornerHandles.slice(0, idx),
      cornerHandle,
      ...this.cornerHandles.slice(idx)
    ];

    // New midpoints left and right 
    const midBefore = this.createMidpoint(updatedCorners, idx - 1);
    const midAfter = this.createMidpoint(updatedCorners, idx);
    this.midpoints = [
      ...this.midpoints.slice(0, idx - 1),
      midBefore,
      midAfter,
      ...this.midpoints.slice(idx)
    ];

    // Delete old midpoint
    this.grabbedElement.parentNode.removeChild(this.grabbedElement);
    
    // Make the newly created corner dragged element + selection
    this.grabbedElement = cornerHandle;
    this.onSelectCorner(cornerHandle)();

    // Update shape
    this.setPoints(updatedCorners);
  }

  onGrab = element => evt => {
    if (evt.button !== 0) return;  // left click

    this.deselectCorners();

    this.grabbedElement = element;
    this.grabbedAt = this.getSVGPoint(evt);
  }

  onKeyDown = ({ which }) => {
    if (which === 46) {
      this.deleteSelected();
    }
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
  }

  onMoveCornerHandle = pos => {
    const handleIdx = this.cornerHandles.indexOf(this.grabbedElement);

    const updatedPoints = getPoints(this.shape).map((pt, idx) =>
      (idx === handleIdx) ? pos : pt);

    this.setPoints(updatedPoints);
  }

  onMouseMove = evt => {
    if (this.grabbedElement) {
      const pos = this.getSVGPoint(evt);

      if (this.grabbedElement === this.shape) {
        this.onMoveShape(pos);
      } else if (hasClass(this.grabbedElement, 'a9s-handle')) {
        this.onMoveCornerHandle(pos);
      } else if (hasClass(this.grabbedElement, 'a9s-midpoint')) {
        this.onAddPoint(pos);
      }

      const points = getPoints(this.shape).map(({x, y}) => [x, y]);
      this.emit('update', toSVGTarget(points, this.env.image));
    }
  }

  onMouseUp = evt => {
    this.grabbedElement = null;
    this.grabbedAt = null;
  }

  onSelectCorner = handle => () => {
    this.deselectCorners();

    const idx = this.cornerHandles.indexOf(handle);
    this.selected = [ idx ];

    addClass(handle, 'selected');
  }

  setPoints = points => {
    // Not using .toFixed(1) because that will ALWAYS
    // return one decimal, e.g. "15.0" (when we want "15")
    const round = num =>
      Math.round(10 * num) / 10;

    // Set polygon points
    const str = points.map(pt => `${round(pt.x)},${round(pt.y)}`).join(' ');

    const inner = this.shape.querySelector('.a9s-inner');
    inner.setAttribute('points', str);

    const outer = this.shape.querySelector('.a9s-outer');
    outer.setAttribute('points', str);

    // Corner handles
    points.forEach((pt, idx) => this.setHandleXY(this.cornerHandles[idx], pt.x, pt.y));

    // Midpoints 
    for (let i=0; i<points.length; i++) {
      const thisCorner = points[i];
      const nextCorner = i === points.length - 1 ? points[0] : points[i + 1];

      const x = (thisCorner.x + nextCorner.x) / 2;
      const y = (thisCorner.y + nextCorner.y) / 2;

      const handle = this.midpoints[i];
      handle.setAttribute('cx', x);
      handle.setAttribute('cy', y);
    }

    // Mask
    this.mask.redraw();

    // Resize formatter elements
    const { x, y, width, height } = outer.getBBox();
    setFormatterElSize(this.shape, x, y, width, height);
  }

}