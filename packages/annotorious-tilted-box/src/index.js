import { Annotorious } from '@recogito/annotorious';
import TiltedBoxTool from './TiltedBoxTool';

const TiltedBoxPlugin = anno => {

  anno.addDrawingTool('tilted-box', TiltedBoxTool);
  
}

export default TiltedBoxPlugin;

(function() {

  const anno = new Annotorious({
    image: document.getElementById('hallstatt')
  });
  
  TiltedBoxPlugin(anno);

  anno.setDrawingTool('tilted-box');

})();