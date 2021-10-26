import PointSelectionTool from './PointSelectionTool';

const PointSelector = (anno, config) => {

  anno.addDrawingTool(PointSelectionTool);
  
}

export default PointSelector;