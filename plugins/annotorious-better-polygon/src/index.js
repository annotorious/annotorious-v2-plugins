import ImRubberbandPolygonTool from './ImRubberbandPolygonTool';

import './index.css';

const ImprovedPolygonPlugin = anno => {

  anno.addDrawingTool(ImRubberbandPolygonTool);

}

export default ImprovedPolygonPlugin;