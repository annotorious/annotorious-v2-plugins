import Rectangle from './icons/Rectangle';
import Polygon from './icons/Polygon';

import './index.css';

// IE11 doesn't support adding/removing classes to SVG elements except 
// via .setAttribute
const addClass = (el, className) => {
  const classNames = new Set(el.getAttribute('class').split(' '));
  classNames.add(className);
  el.setAttribute('class', Array.from(classNames).join(' '));
}

const removeClass = (el, className) => {
  const classNames = el.getAttribute('class').split(' ').filter(c => c !== className);
  el.setAttribute('class', classNames.join(' '));
}

const Toolbar = (anno, opt_container) => {

  const container = document.createElement('div');
  container.className = 'a9s-toolbar';

  const clearSelected = () => {
    const selected = container.querySelector('.a9s-toolbar-btn.active');
    removeClass(selected, 'active');
  }

  const createButton = (toolId, icon, container) => {

    const button = document.createElement('button');
    button.className = `a9s-toolbar-btn ${toolId}`;

    const inner = document.createElement('span');
    inner.className = 'a9s-toolbar-btn-inner';

    button.appendChild(inner);
    inner.appendChild(icon);
  
    button.addEventListener('click', () => {
      clearSelected();
      addClass(button, 'active');
      anno.setDrawingTool(toolId);
    });
  
    container.appendChild(button);
  
    return button;
  }
  
  // TODO sniff drawing tools

  const initial = createButton('rect', Rectangle(), container);
  addClass(initial, 'active');

  createButton('polygon', Polygon(), container);

  // TODO what if null?
  opt_container.appendChild(container);

}

export default Toolbar;