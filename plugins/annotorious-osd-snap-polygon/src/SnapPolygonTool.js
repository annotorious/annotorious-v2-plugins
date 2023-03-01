import Tool from '@recogito/annotorious/src/tools/Tool';
import SnapEditablePolygon from './SnapEditablePolygon';
import SnapRubberbandPolygon from './SnapRubberbandPolygon';
import { getNearestSnappablePoint } from './storeUtils';
import { drawCursor, setCursorXY, scaleCursor, setSnapEnabled } from './SnapCursor';
import SnapEditablePath from './SnapEditablePath';

export const toSVGTarget = (points, image, closeShape) => {
  const [head, ...tail]= points;

  const value = closeShape ? 
    `<svg><polygon points="${points.map(t => `${t[0]},${t[1]}`).join(' ')}" /></svg>` :
    `<svg><path d="M${head[0]} ${head[1]} ${tail.map(([x,y]) => `L${x} ${y}`).join(' ')}"></path></svg>`;

  return {
    source: image?.src,
    selector: {
      type: "SvgSelector", value
    }
  }
}

export default class SnapPolygonTool extends Tool {

  constructor(g, config, env) {
    super(g, config, env);

    this._isDrawing = false;

    this._startOnSingleClick = false;

    this._isSnapEnabled = false;

    this._enabled = false; // tracks hotkey/toolbar enabled state

    this._dragged = false; // tracks if drag has happend in between

    this.snappedPosition = [0, 0];

    this.svg.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keydown', this.onKeyDown);

    this.svg.addEventListener('pointermove', this.onPointerMove);
  }

  onKeyDown = evt => {
    // Ignore keyboard events that come from the editor
    const isEditor = evt.target.closest('.r6o-editor');
    
    if (isEditor)
      return;

    if (evt.key === 'S' || evt.key === 's') {
      this._isSnapEnabled = !this._isSnapEnabled;

      if (this.cursor)
        setSnapEnabled(this.cursor, this._isSnapEnabled);

      if (this.editable)
        this.editable.setSnapEnabled(this._isSnapEnabled);
    }
  }

  /**
   * A pointer move handler that's ALWAYS on, not just when a 
   * shape is being created. We use this to create the snapping 
   * hover cursor.
   */
  onPointerMove = evt => {
    const { x, y } = this.getSVGPoint(evt);

    if (this._isSnapEnabled) {
      const snappablePoint = getNearestSnappablePoint(this.env, this.scale, [x,y]);

      if (snappablePoint)
        this.snappedPosition = snappablePoint;
      else
        this.snappedPosition = [x, y];  
    } else {
      this.snappedPosition = [x, y];
    }

    if (this.cursor)
      setCursorXY(this.cursor, this.snappedPosition);    
  } 

  get isDrawing() {
    return this._isDrawing;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled) {
    if (enabled && !this.cursor) {
      this.cursor = drawCursor(this.snappedPosition, this.scale);

      setSnapEnabled(this.cursor, this._isSnapEnabled);
      
      this.g.appendChild(this.cursor);
    } else if (!enabled && this.cursor) {
      this.g.removeChild(this.cursor);
      this.cursor = null;
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

    this.rubberband.on('done', ({ shape, selection }) => {
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
      this.rubberband.done(false);
      this.stop();
    }
  }

  onMouseMove = () => {
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
      scaleCursor(this.cursor, scale);

    if (this.rubberband)
      this.rubberband.onScaleChanged(scale);
  }

  destroy = () => {
    this.svg.removeEventListener('pointermove', this.onPointerMove);

    this.svg.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keydown', this.onKeyDown);

    super.destroy();
  }

  createEditableShape = annotation => {
    if (this.editable)
      this.editable.destroy();

    const isClosed = annotation.selector('SvgSelector').value.match(/^<svg.*<polygon/g);

    if (isClosed)
      this.editable = new SnapEditablePolygon(annotation, this.g, this.config, this.env, () => this.destroy());
    else 
      this.editable = new SnapEditablePath(annotation, this.g, this.config, this.env, () => this.destroy());

    this.editable.setSnapEnabled(this._isSnapEnabled);
    return this.editable;
  }

}

SnapPolygonTool.identifier = 'polygon';

SnapPolygonTool.supports = annotation => {
  const selector = annotation.selector('SvgSelector');
  if (selector)
    return selector.value?.match(/^<svg.*<polygon/g) || selector.value?.match(/^<svg.*<path/g);
}