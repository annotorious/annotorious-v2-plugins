import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { drawEmbeddedSVG } from '@recogito/annotorious/src/selectors';

export default class EditableTiltedBox extends EditableShape {

  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);

    this._element = drawEmbeddedSVG(annotation);
    this._element.setAttribute('class', `a9s-annotation selected`);

    g.appendChild(this._element);
  }

  get element() {
    return this._element;
  }

  destroy() {
    this._element.parentNode.removeChild(this._element);
    super.destroy();
  }

}