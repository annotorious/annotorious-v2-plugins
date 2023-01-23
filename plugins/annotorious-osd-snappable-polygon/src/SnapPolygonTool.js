import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import Tool from '@recogito/annotorious/src/tools/Tool';
import SnapEditablePolygon from './SnapEditablePolygon';
import SnapRubberbandPolygon from './SnapRubberbandPolygon';
import { getNearestSnappablePoint } from './storeUtils';

export const toSVGTarget = (points, image) => ({
  source: image?.src,
  selector: {
    type: "SvgSelector",
    value: `<svg><polygon points="${points.map(t => `${t[0]},${t[1]}`).join(' ')}" /></svg>`
  }
});

export default class SnapPolygonTool extends Tool {

  constructor(g, config, env) {
    super(g, config, env);

    this._isDrawing = false;
    this._startOnSingleClick = false;

    // Track mouse movement and draw the snapping cursor
    this.svg.addEventListener('pointermove', this.onPointerMove);

    this.cursor = this.drawHandle(0, 0);

    g.appendChild(this.cursor);
  }

  /**
   * A pointer move handler that's ALWAYS on, not just when a 
   * shape is being created. We use this to create the snapping 
   * hover cursor.
   */
  onPointerMove = evt => {
    const { x, y } = this.getSVGPoint(evt);
    const snappablePoint = getNearestSnappablePoint(this.env, this.scale, [x,y]);

    if (snappablePoint) {
      this.setHandleXY(this.cursor, snappablePoint[0], snappablePoint[1]);
    } else {
      this.setHandleXY(this.cursor, x, y);
    }
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
      new SnapRubberbandPolygon([x, y], this.g, this.config, this.env);

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

  onMouseMove = (x, y) => {
    console.log('dragTo');
    this.rubberband.dragTo([x, y]);
  } 

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
    this.scaleHandle(this.cursor);

    if (this.rubberband)
      this.rubberband.onScaleChanged(scale);
  }

  createEditableShape = annotation =>
    new SnapEditablePolygon(annotation, this.g, this.config, this.env);

  destroy = () => {
    super.destroy();
    this.svg.removeEventListener('pointermove', this.onPointerMove);
  }

}

SnapPolygonTool.identifier = 'polygon';

SnapPolygonTool.supports = annotation => {
  const selector = annotation.selector('SvgSelector');
  if (selector)
    return selector.value?.match(/^<svg.*<polygon/g);
}