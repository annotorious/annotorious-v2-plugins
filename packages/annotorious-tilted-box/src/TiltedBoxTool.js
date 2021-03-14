import EventEmitter from 'tiny-emitter';
import RubberbandTiltedBox from './RubberbandTiltedBox';

// Event Emitter could go into a base class
export default class TiltedBoxTool extends EventEmitter {

  constructor(g, config, env) {
    super();
    
    // This could be moved into a base class
    this.svg = g.closest('svg');

    this.g = g;
    this.config = config;
    this.env = env;
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

  startDrawing = evt => {
    const { x, y } = this._toSVG(evt.layerX, evt.layerY);
    this._attachListeners();
    this.rubberband = new RubberbandTiltedBox(x, y, this.g, this.env);
  }

  stop = () => {
    if (this.rubberband) {
      this.rubberband.destroy();
      this.rubberband = null;
    }
  }

  onMouseMove = evt => {
    const { x , y } = this._toSVG(evt.layerX, evt.layerY);
    this.rubberband.onMouseMove(x, y);
  }
  
  onMouseUp = evt => {
    if (this.rubberband.isCollapsed) {
      this.emit('cancel', evt);
      this.stop();
    } else {
      const { x , y } = this._toSVG(evt.layerX, evt.layerY);
      this.rubberband.onMouseUp([ x, y ]);
    }

    /*
    const { w } = this.rubberband.bbox;

    if (w > 3) {
      // Emit the SVG shape with selection attached    
      const { element } = this.rubberband;
      element.annotation = this.rubberband.toSelection();

      // Emit the completed shape...
      this.emit('complete', element);
    } else {
      this.emit('cancel', evt);
    }

    this.stop();
    */
  }

  createEditableShape = annotation =>
    new EditableRect(annotation, this.g, this.config, this.env);

  get isDrawing() {
    return this.rubberband != null;
  }

  get supportsModify() {
    return true;
  }

}