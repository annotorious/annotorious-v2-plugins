import TiltedBoxTool from './TiltedBoxTool';

const TiltedBoxPlugin = anno => {

  anno.addDrawingTool(TiltedBoxTool);
  
}

export default TiltedBoxPlugin;