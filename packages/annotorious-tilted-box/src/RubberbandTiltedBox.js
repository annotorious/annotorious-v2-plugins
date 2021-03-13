import { Selection } from '@recogito/recogito-client-core';

/**
 * A 'rubberband' selection tool for creating a rectangle by
 * clicking and dragging.
 */
export default class RubberbandRect {

  constructor(anchorX, anchorY, g, env) {

  }

  dragTo = (oppositeX, oppositeY) => {
    // Make visible
    this.group.style.display = null;

    this.opposite = [ oppositeX, oppositeY ];
    const { x, y, w, h } = this.bbox;

    setRectMaskSize(this.mask, this.env.image, x, y, w, h);
    setRectSize(this.rect, x, y, w, h);
  }

  toSelection = () => {
    const { x, y, w, h } = this.bbox;
    return new Selection(toRectFragment(x, y, w, h, this.env.image));
  }

  destroy = () => {

  }

}