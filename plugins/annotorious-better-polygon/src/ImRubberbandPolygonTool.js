import Tool from '@recogito/annotorious/src/tools/Tool';
import { isTouchDevice } from '@recogito/annotorious/src/util/Touch';

import ImEditablePolygon from './ImEditablePolygon';
import ImRubberbandPolygon from './ImRubberbandPolygon';

const isTouch = isTouchDevice();

export const toSVGTarget = (points, image) => ({
  source: image?.src,
  selector: {
    type: "SvgSelector",
    value: `<svg><polygon points="${points.map(t => `${t[0]},${t[1]}`).join(' ')}" /></svg>`
  }
});

export default class ImRubberbandPolygonTool extends Tool {

  constructor(g, config, env) {
    super(g, config, env);

    this._isDrawing = false;
    this._startOnSingleClick = false;
  }

  get isDrawing() {
    return this._isDrawing;
  }

  startDrawing = (x, y, startOnSingleClick) => {
    this._isDrawing = true;
    this._startOnSingleClick = startOnSingleClick;

    this.attachListeners({
      mouseMove: this.onMouseMove,
      mouseUp: this.onMouseUp,
      dblClick: this.onDblClick
    });

    this.rubberband =
      new ImRubberbandPolygon([x, y], this.g, this.config, this.env);

    this.rubberband.on('close', ({ shape, selection }) => {
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

  onDblClick = () => {
    if (this.rubberband?.points.length > 2) {
      this.rubberband.close();
      this.stop();
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
    } else if (!this._startOnSingleClick) {
      this.emit('cancel');
      this.stop();
    }
  }

  onScaleChanged = scale => {
    if (this.rubberband)
      this.rubberband.onScaleChanged(scale);
  }

  createEditableShape = annotation =>
    new ImEditablePolygon(annotation, this.g, this.config, this.env);

}

ImRubberbandPolygonTool.identifier = 'polygon';

ImRubberbandPolygonTool.supports = annotation => {
  const selector = annotation.selector('SvgSelector');
  if (selector)
    return selector.value?.match(/^<svg.*<polygon/g);
}