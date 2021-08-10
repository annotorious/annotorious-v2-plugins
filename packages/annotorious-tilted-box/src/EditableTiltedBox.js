import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import { svgFragmentToShape } from '@recogito/annotorious/src/selectors';

import {
  createBaseline,
  createBox,
  createMinorHandle
} from './TiltedBox';

export default class EditableTiltedBox extends EditableShape {

  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);

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
    this._element.setAttribute('class', 'a9s-annotation editable selected');

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

    // Mouse xy offset inside the shape, if mouse pressed
    this.mouseOffset = null;
  }

  scaleHandles = scale => {
    // TODO 
  }

  onGrab = grabbedElem => evt => {
    if (evt.button !== 0) return;  // left click
    
    this.grabbedElem = grabbedElem;

    console.log('grabbed', grabbedElem);
    
    /*
    const pos = this.getSVGPoint(evt);
    const { x, y } = getRectSize(this.rectangle);
    
    this.mouseOffset = { x: pos.x - x, y: pos.y - y };
    */
  }

  onMouseMove = evt => {
    // TODO
  }

  onMouseUp = () => {
    this.grabbedElem = null;
    this.mouseOffset = null;
  }

  get element() {
    return this._element;
  }

  destroy() {
    this.containerGroup.parentNode.removeChild(this.containerGroup);
    super.destroy();
  }

}