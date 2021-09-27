import createRectangle from './icons/Rectangle';
import createPolygon from './icons/Polygon';
import createCircle from './icons/Circle';
import createEllipse from './icons/Ellipse';
import createFreehand from './icons/Freehand';
import createPoint from './icons/Point';
import createTiltedBox from './icons/TiltedBox';

import './index.css';

const ICONS = {
  'rect': createRectangle(),
  'polygon': createPolygon(),
  'circle': createCircle(),
  'ellipse': createEllipse(),
  'freehand': createFreehand(),
  'point': createPoint(), 
  'annotorious-tilted-box': createTiltedBox()
}

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

const Toolbar = (anno, container) => {
  // Bit of a hack...
  const isOSDPlugin = !!anno.fitBounds;

  const toolbar = document.createElement('div');
  toolbar.className = 'a9s-toolbar';

  const clearActive = () => {
    const currentActive = toolbar.querySelector('.a9s-toolbar-btn.active');
    if (currentActive)
      removeClass(currentActive, 'active');
  }

  const setActive = button => {
    clearActive();
    addClass(button, 'active');
  }

  // Helper to create one tool button 
  const createButton = (toolId, isActive) => {
    const icon = ICONS[toolId];

    if (icon) {
      const button = document.createElement('button');

      if (isActive)
        button.className = `a9s-toolbar-btn ${toolId} active`;
      else
        button.className = `a9s-toolbar-btn ${toolId}`;

      const inner = document.createElement('span');
      inner.className = 'a9s-toolbar-btn-inner';

      inner.appendChild(icon);

      button.addEventListener('click', () => {
        setActive(button);
        anno.setDrawingTool(toolId);

        if (isOSDPlugin)
          anno.setDrawingEnabled(true);
      });

      button.appendChild(inner);
      toolbar.appendChild(button);
    }
  }
  
  anno.listDrawingTools().forEach((toolId, idx) => {
    // In standard version, activate first button
    const activateFirst = !isOSDPlugin && idx === 0; 
    createButton(toolId, activateFirst);        
  });

  if (isOSDPlugin)
    anno.on('createSelection', clearActive);

  container.appendChild(toolbar);
}

export default Toolbar;