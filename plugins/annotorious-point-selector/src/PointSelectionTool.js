import Tool, { Selection } from '@recogito/annotorious/src/tools/Tool';
import { toRectFragment } from '@recogito/annotorious/src/selectors/RectFragment';

import { drawPoint, setPointXY, getPointXY } from './Point';
import EditablePoint from './EditablePoint';

export default class PointSelectionTool extends Tool {

  constructor(g, config, env) {
    super(g, config, env);
  }

  startDrawing = (x, y, evt) => {
    // Start drawing a new point, unless this is a selection
    // on an existing one
    const selectedPoint = evt.target.closest('.a9s-point'); 
      if (!selectedPoint) {

      this.attachListeners({
        mouseMove: this.onMouseMove,
        mouseUp: this.onMouseUp
      });

      this.point = drawPoint(x, y);
      this.point.setAttribute('class', 'a9s-selection');

      this.g.appendChild(this.point);
    } else {
      this.emit('cancel');
    }
  }

  stop = () => {
    if (this.point !== null)
      this.point = null;
  }

  onMouseMove = (x, y) =>
    setPointXY(this.point, x, y);
  
  onMouseUp = () => {
    this.detachListeners();
    
    const { x, y } = getPointXY(this.point);

    const rectFragment = 
      toRectFragment(x, y, 0, 0, this.env.image, this.config.fragmentUnit);

    const selection = new Selection({ 
      ...rectFragment,
      renderedVia: {
        name: 'point'
      }
    });

    this.point.annotation = selection;
    this.emit('complete', this.point);

    this.stop();
  }

  get isDrawing() {
    return this.point != null;
  }
  
  createEditableShape = annotation =>
    new EditablePoint(annotation, this.g, this.config, this.env);

}

PointSelectionTool.identifier = 'point';

/** Not needed because we use renderedVia prop **/
PointSelectionTool.supports = annotation => false;
