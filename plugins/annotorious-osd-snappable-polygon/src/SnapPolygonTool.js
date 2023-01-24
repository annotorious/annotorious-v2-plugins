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

    // Track hotkey/toolbar enabled state
    this._enabled = false;

    // Track if drag happend in between
    this._dragged = false;

    this.svg.addEventListener('pointermove', this.onPointerMove);
  }

  /**
   * A pointer move handler that's ALWAYS on, not just when a 
   * shape is being created. We use this to create the snapping 
   * hover cursor.
   */
  onPointerMove = evt => {
    const { x, y } = this.getSVGPoint(evt);
    
    const snappablePoint = getNearestSnappablePoint(this.env, this.scale, [x,y]);

    if (snappablePoint)
      this.snappedPosition = snappablePoint;
    else
      this.snappedPosition = [x, y];

    if (this.cursor)
      this.setHandleXY(this.cursor, this.snappedPosition[0], this.snappedPosition[1]);    
  } 

  get isDrawing() {
    return this._isDrawing;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled) {
    if (enabled && !this.cursor) {
      this.cursor = this.drawHandle(this.snappedPosition[0], this.snappedPosition[1]);
      this.g.appendChild(this.cursor);
    }

    this._enabled = enabled;
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
      new SnapRubberbandPolygon(this.snappedPosition, this.g, this.config, this.env);

    this.rubberband.on('close', ({ shape, selection }) => {
      shape.annotation = selection;
      this.emit('complete', shape);  
      this.stop();
    }); 
  }

  stop = () => {
    this.detachListeners();

    this._isDrawing = false;

    if (this.cursor) {
      this.g.removeChild(this.cursor);
      this.cursor = null;
    }

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
    this.rubberband.dragTo(this.snappedPosition);
  } 

  onMouseUp = () => {
    // Ignore mouse up if drag happened in between
    if (!this._dragged) {
      const { width, height } = this.rubberband.getBoundingClientRect();

      const minWidth = this.config.minSelectionWidth || 4;
      const minHeight = this.config.minSelectionHeight || 4;
      
      if (width >= minWidth || height >= minHeight) {
        this.rubberband.addPoint();
      } else if (!this._startOnSingleClick) {
        this.emit('cancel');
        this.stop();
      }
    } else {
      this._dragged = false;
    }
  }

  /**
   * When the user first drags after creating a point, the last point should  **/
  onDragStart = () =>
    this._dragged = true;

  onScaleChanged = scale => {
    if (this.cursor)
      this.scaleHandle(this.cursor);

    if (this.rubberband)
      this.rubberband.onScaleChanged(scale);
  }

  destroy = () => {
    this.svg.removeEventListener('pointermove', this.onPointerMove);

    super.destroy();
  }

  createEditableShape = annotation =>
    new SnapEditablePolygon(annotation, this.g, this.config, this.env, () => this.destroy());

}

SnapPolygonTool.identifier = 'polygon';

SnapPolygonTool.supports = annotation => {
  const selector = annotation.selector('SvgSelector');
  if (selector)
    return selector.value?.match(/^<svg.*<polygon/g);
}