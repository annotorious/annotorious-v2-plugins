import Tool from '@recogito/annotorious/src/tools/Tool';
import { addClass } from '@recogito/annotorious/src/util/SVG';
import EditableTiltedBox from './EditableTiltedBox';
import TiltedBox from './TiltedBox';

import './TiltedBoxTool.scss';

export default class TiltedBoxTool extends Tool {

  constructor(g, config, env) {
    super(g, config, env);
    
    this.drawingState = null;
    this.rubberbandShape = null;
  }

  startDrawing = (x, y) => {
    this.attachListeners({
      mouseMove: this.onMouseMove,
      mouseUp: this.onMouseUp
    });

    this.drawingState = 'BASELINE';

    this.rubberbandShape = new TiltedBox([
      [ x, y ],
      [ x, y ],
      [ x, y ],
      [ x, y ]
    ]);

    addClass(this.rubberbandShape.element, 'a9s-selection');

    this.g.appendChild(this.rubberbandShape.element);
  }

  onMouseMove = (x, y) => {
    if (this.drawingState === 'BASELINE')
      this.rubberbandShape.setBaseEnd(x, y);
    else if (this.drawingState === 'EXTRUDE')
      this.rubberbandShape.extrude(x, y);
  }
  
  onMouseUp = () => {
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
      this.stop();
    }
  }

  stop = () => {
    this.detachListeners();
    this.drawingState = null;
    
    if (this.rubberbandShape) {
      this.rubberbandShape.destroy();
      this.rubberbandShape = null;
    }
  }

  get isDrawing() {
    return this.drawingState != null;
  }

  createEditableShape = annotation =>
    new EditableTiltedBox(annotation, this.g, this.config, this.env);

}

TiltedBoxTool.identifier = 'annotorious-tilted-box';

TiltedBoxTool.supports = annotation => {
  return false;
}