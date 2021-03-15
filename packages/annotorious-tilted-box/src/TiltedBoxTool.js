import EventEmitter from 'tiny-emitter';
import { addClass } from '@recogito/annotorious/src/util/SVG';
import TiltedBox from './TiltedBox';

import './TiltedBoxTool.scss';

// Event Emitter could go into a base class
export default class TiltedBoxTool extends EventEmitter {

  constructor(g, config, env) {
    super();
    
    // This could be moved into a base class
    this.svg = g.closest('svg');

    this.g = g;
    this.config = config;
    this.env = env;

    this.drawingState = null;
    this.rubberbandShape = null;
  }

  /**
   * This could be moved into a base class
   */
  _attachListeners = () => {
    this.svg.addEventListener('mousemove', this.onMouseMove);    
    document.addEventListener('mouseup', this.onMouseUp);
  }

  /**
   * This could be moved into a base class
   */
  _detachListeners = () => {
    this.svg.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  /**
   * This could be moved into a base class
   */
  _toSVG = (x, y) => {
    const pt = this.svg.createSVGPoint();

    const { left, top } = this.svg.getBoundingClientRect();
    pt.x = x + left;
    pt.y = y + top;

    return pt.matrixTransform(this.g.getScreenCTM().inverse());
  }   

  get isDrawing() {
    return this.drawingState != null;
  }

  startDrawing = evt => {
    this._attachListeners();

    this.drawingState = 'BASELINE';

    const { x, y } = this._toSVG(evt.layerX, evt.layerY);
    this.rubberbandShape = new TiltedBox([
      [ x, y ],
      [ x, y ],
      [ x, y ],
      [ x, y ]
    ]);

    addClass(this.rubberbandShape.element, 'a9s-selection');

    this.g.appendChild(this.rubberbandShape.element);
  }

  onMouseMove = evt => {
    const { x , y } = this._toSVG(evt.layerX, evt.layerY);

    if (this.drawingState === 'BASELINE')
      this.rubberbandShape.setBaseEnd(x, y);
    else if (this.drawingState === 'EXTRUDE')
      this.rubberbandShape.extrude(x, y);
  }
  
  onMouseUp = evt => {
    if (this.drawingState === 'BASELINE') {
      if (this.rubberbandShape.isCollapsed) {
        this.emit('cancel');
        this.stop();
      } else {
        this.drawingState = 'EXTRUDE'
      }
    } else if (this.drawingState === 'EXTRUDE') {
      const shape = this.rubberbandShape.element;
      shape.annotation = this.rubberbandShape.toSelection(this.env.image.src);
      this.emit('complete', shape);
    }
  }

  stop = () => {
    if (this.rubberbandShape) {
      this.rubberbandShape.destroy();
      this.rubberbandShape = null;
    }
  }

  /*
  createEditableShape = annotation =>
    new EditableRect(annotation, this.g, this.config, this.env);

  get supportsModify() {
    return true;
  }
  */

}