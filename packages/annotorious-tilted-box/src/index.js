import TiltedBoxTool from './TiltedBoxTool';

const TiltedBoxPlugin = anno => {

  anno.addDrawingTool('tilted-box', TiltedBoxTool);
  
}

export default TiltedBoxPlugin;