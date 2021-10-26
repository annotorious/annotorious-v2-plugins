import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { parseRectFragment, toRectFragment } from '@recogito/annotorious/src/selectors/RectFragment';

import { drawPoint, setPointXY } from './Point';

export default class EditablePoint extends EditableShape {

  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);

    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    const { x, y } = parseRectFragment(annotation);

    // SVG markup for this class looks like this:
    //
    // <g>
    //   <g> <-- return this node as .element
    //     <circle class="a9s-outer" ... />
    //     <circle class="a9s-inner" ... />
    //   </g>
    // </g>

    this.containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');

    this.point = drawPoint(x, y);
    this.point.setAttribute('class', 'a9s-annotation editable selected');

    this.point.querySelector('.a9s-inner')
      .addEventListener('mousedown', this.onGrab);
    this.point.querySelector('.a9s-outer')
      .addEventListener('mousedown', this.onGrab);

    this.containerGroup.appendChild(this.point);
    this.g.appendChild(this.containerGroup);

    this.grabbed = false;
  }

  onGrab = evt => {
    if (evt.button !== 0) return;  // left click
    this.grabbed = true;
  }

  onMouseMove = evt => {
    if (evt.button !== 0) return;  // left click


    if (this.grabbed) {
      const pos = this.getSVGPoint(evt);
      const { x, y } = pos;

      setPointXY(this.point, x, y);

      const rectFragment = {
        ... toRectFragment(x, y, 0, 0, this.env.image, this.config.fragmentUnit),
        renderedVia: {
          name: 'point'
        }
      };

      this.emit('update', rectFragment);
    }
  }

  onMouseUp = evt => {
    this.grabbed = false;
  }

  get element() { 
    return this.point;
  }

  destroy = () => {
    this.g.removeChild(this.containerGroup);
    
    super.destroy();
  }

}