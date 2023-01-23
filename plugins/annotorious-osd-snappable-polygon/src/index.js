import SnapPolygonTool from './SnapPolygonTool';

import './index.css';

const SnappablePolygonPlugin = anno => {

  anno.addDrawingTool(SnapPolygonTool);

}

export default SnappablePolygonPlugin;