import Tool from '@recogito/annotorious/src/tools/Tool';

import ImEditablePolygon from './ImEditablePolygon';
import ImRubberbandPolygon from './ImRubberbandPolygon';

export default class ImRubberbandPolygonTool extends Tool {

  constructor(g, config, env) {
    super(g, config, env);

    this._isDrawing = false;
  }

  scaleHandles = scale => {
    if (this.rubberband)
      this.rubberband.setScale(scale);
  }

  get isDrawing() {
    return this._isDrawing;
  }

  startDrawing = (x, y) => {
    this._isDrawing = true;

    this.attachListeners({
      mouseMove: this.onMouseMove,
      mouseUp: this.onMouseUp
    });

    this.rubberband =
      new ImRubberbandPolygon([x, y], this.g, this.config, this.env);

    this.rubberband.on('close', ({ shape, selection }) => {
      
      console.log('closed', shape, selection);

      shape.annotation = selection;
      this.emit('complete', shape);  
      this.stop();
    });
  }

  stop = () => {
    this.detachListeners();

    this._isDrawing = false;

    if (this.rubberband) {
      this.rubberband.destroy();
      this.rubberband = null;
    }
  }

  onMouseMove = (x, y) =>
    this.rubberband.dragTo([x, y]);

  onMouseUp = () => {
    const { width, height } = this.rubberband.getBoundingClientRect();

    const minWidth = this.config.minSelectionWidth || 4;
    const minHeight = this.config.minSelectionHeight || 4;
    
    if (width >= minWidth || height >= minHeight) {
      this.rubberband.addPoint();
    } else {
      this.emit('cancel');
      this.stop();
    }
  }

  createEditableShape = annotation =>
    new ImEditablePolygon(annotation, this.g, this.config, this.env);

}

ImRubberbandPolygonTool.identifier = 'im-polygon';

ImRubberbandPolygonTool.supports = annotation => {
  const selector = annotation.selector('SvgSelector');
  if (selector)
    return selector.value?.match(/^<svg.*<polygon/g);
}