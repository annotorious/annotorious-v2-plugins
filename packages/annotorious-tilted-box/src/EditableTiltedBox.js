import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import { svgFragmentToShape, toSVGTarget } from '@recogito/annotorious/src/selectors';

import {
  createBaseline,
  createBox,
  createMinorHandle,
  getBoxPoints,
  setBaseline,
  setBoxPoints
} from './TiltedBox';

const getBBox = shape =>
  shape.querySelector('.a9s-inner').getBBox();

export default class EditableTiltedBox extends EditableShape {

  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);

    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    const points = svgFragmentToShape(annotation)
      .getAttribute('points')
      .split(' ')
      .map(t => t.split(',').map(num => parseFloat(num)));

    // Shorthand
    const [ a, b, c, _ ] = points;

    // 'g' for the compound shape (and mask -  in the future)
    this.containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');

    // The 'element' (baseline, box, handles)
    this._element = document.createElementNS(SVG_NAMESPACE, 'g');
    this._element.setAttribute('class', 'a9s-annotation tilted-box editable selected');

    this.box = createBox(points);
    this.box.querySelector('.a9s-inner')
      .addEventListener('mousedown', this.onGrab(this.box));

    this.baseline = createBaseline(a, b); 
    
    this.pivotHandle = this.drawHandle(a[0], a[1]);
    this.baseEndHandle = createMinorHandle(b, config.handleRadius);
    this.oppositeHandle = createMinorHandle(c, config.handleRadius);

    [this.pivotHandle, this.baseEndHandle, this.oppositeHandle].map(elem => {
      elem.addEventListener('mousedown', this.onGrab(elem));
    });

    this._element.appendChild(this.box);
    this._element.appendChild(this.baseline);
    this._element.appendChild(this.pivotHandle);
    this._element.appendChild(this.baseEndHandle);
    this._element.appendChild(this.oppositeHandle);

    this.containerGroup.appendChild(this._element);

    g.appendChild(this.containerGroup);

    // The grabbed element (handle or entire group), if any
    this.grabbedElem = null;

    // Mouse grab point
    this.grabbedAt = null;
  }

  setShape = points => {
    setBoxPoints(this.box, points);
    setBaseline(this.baseline, points[0], points[1]);

    this.baseEndHandle.setAttribute('cx', points[1][0]);
    this.baseEndHandle.setAttribute('cy', points[1][1]);

    this.oppositeHandle.setAttribute('cx', points[2][0]);
    this.oppositeHandle.setAttribute('cy', points[2][1]);

    this.setHandleXY(this.pivotHandle, points[0][0], points[0][1]);
  }

  scaleHandles = scale => {
    // Pivot
    const inner = this.pivotHandle.querySelector('.a9s-handle-inner');
    const outer = this.pivotHandle.querySelector('.a9s-handle-outer');

    const radius = scale * (this.config.handleRadius || 6);

    inner.setAttribute('r', radius);
    outer.setAttribute('r', radius);

    // Minor handles
    const minorRadius = Math.round(0.8 * radius);
    this.baseEndHandle.setAttribute('r', minorRadius);
    this.oppositeHandle.setAttribute('r', minorRadius);
  }

  onGrab = grabbedElem => evt => {
    if (evt.button !== 0) return;  // left click
    this.grabbedElem = grabbedElem;
    this.grabbedAt = this.getSVGPoint(evt);
  }

  onMouseMove = evt => {
    const constrain = (coord, delta, max) =>
      coord + delta < 0 ? -coord : (coord + delta > max ? max - coord : delta);

    if (this.grabbedElem) {
      const pos = this.getSVGPoint(evt);

      if (this.grabbedElem === this.box || this.grabbedElem === this.pivotHandle) {
        const { x, y, width, height } = getBBox(this.box);

        const { naturalWidth, naturalHeight } = this.env.image;

        const dx = constrain(x, pos.x - this.grabbedAt.x, naturalWidth - width);
        const dy = constrain(y, pos.y - this.grabbedAt.y, naturalHeight - height);

        const updatedPoints = getBoxPoints(this.box).map(pt => [ pt[0] + dx, pt[1] + dy ]);
        this.setShape(updatedPoints);

        this.grabbedAt = pos;
        this.emit('update', {
          ...toSVGTarget(this.box, this.env.image),
          renderedVia: {
            name: 'annotorious-tilted-box'
          }
        });
      } else if (this.grabbedElem === this.baseEndHandle) {

      } else if (this.grabbedElem === this.oppositeHandle) {
        /*
        const handleIdx = this.handles.indexOf(this.grabbedElem);

        const updatedPoints = getPoints(this.shape).map((pt, idx) =>
          (idx === handleIdx) ? pos : pt);

        this.setPoints(updatedPoints);
        this.setHandleXY(this.handles[handleIdx], pos.x, pos.y);

        this.emit('update', toSVGTarget(this.shape, this.env.image));
        */
      }
    }
  }

  onMouseUp = () => {
    this.grabbedElem = null;
    this.grabbedAt = null;
  }

  get element() {
    return this._element;
  }

  destroy() {
    this.containerGroup.parentNode.removeChild(this.containerGroup);
    super.destroy();
  }

}