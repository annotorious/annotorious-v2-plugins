import createRectangle from './icons/Rectangle';
import createPolygon from './icons/Polygon';
import createCircle from './icons/Circle';
import createEllipse from './icons/Ellipse';
import createFreehand from './icons/Freehand';
import createPoint from './icons/Point';
import createTiltedBox from './icons/TiltedBox';
import createLine from './icons/Line';
import createMouse from './icons/Mouse';

import './index.css';

const ICONS = {
  'mouse': createMouse(),
  'rect': createRectangle(),
  'polygon': createPolygon(),
  'circle': createCircle(),
  'ellipse': createEllipse(),
  'freehand': createFreehand(),
  'point': createPoint(), 
  'annotorious-tilted-box': createTiltedBox(),
  'line': createLine()
}

const ICONLABEL = {
  'mouse': '',
  'rect': 'Rectangle',
  'polygon': 'Polygon',
  'circle': 'Circle',
  'ellipse': 'Ellipse',
  'freehand': 'Freehand',
  'point': 'Point',
  'annotorious-tilted-box': 'Angled Box',
  'line': 'Line'
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

const Toolbar = (anno, container, settings={}) => {
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

  const enableDrawing = (toolId, anno) => {
    toolId = toolId ? toolId : toolbar.querySelector('.a9s-toolbar-btn.active').classList[1];
    if (isOSDPlugin && toolId != 'mouse'){
      anno.setDrawingEnabled(true);
    } else if (isOSDPlugin && toolId == 'mouse') {
      anno.setDrawingEnabled(false);
    }
  }

  const osdContainer = (toolId) => {
    const osdcontanier = document.getElementsByClassName('openseadragon-container');
    if (osdcontanier.length > 0) {
      if (toolId == 'mouse'){
        osdcontanier[0].classList.add("moveable");
      } else {
        osdcontanier[0].classList.remove("moveable");
      }
    }
  }

  // Helper to create one tool button 
  const createButton = (toolId, isActive) => {
    const icon = ICONS[toolId];

    if (icon) {
      const button = document.createElement('button');
      button.type = "button";

      if (isActive)
        button.className = `a9s-toolbar-btn ${toolId} active`;
      else
        button.className = `a9s-toolbar-btn ${toolId}`;

      const ariaLabel = ICONLABEL[toolId] ? `Create a ${ICONLABEL[toolId]} annotation` : toolId == 'mouse' ? 'Disable annotation creation, move around the image' : `Create a ${toolId} annotation`;
      button.setAttribute('aria-label', ariaLabel);

      const inner = document.createElement('span');
      inner.className = 'a9s-toolbar-btn-inner';
      inner.appendChild(icon);

      if (settings['withLabel'] && ICONLABEL[toolId]) {
        inner.innerHTML += `<span class="a9s-toolbar-btn-label">${ICONLABEL[toolId]}</span>`;
      }
 
      button.addEventListener('click', () => {
        setActive(button);
        if (toolId != 'mouse'){
          anno.setDrawingTool(toolId);
        }

        osdContainer(toolId);

        if (settings['infoElement']) {
          if (toolId == 'polygon'){
            settings['infoElement'].innerHTML = 'To stop Polygon annotation selection double click.';
          } else {
            settings['infoElement'].innerHTML = '';
          }
        }
        enableDrawing(toolId, anno)
      });



      button.appendChild(inner);
      toolbar.appendChild(button);
      if (settings['withMouse']){
        anno.on('cancelSelected', function() {
          enableDrawing('', anno);
        });
        anno.on('createAnnotation', function(annotation) {
          enableDrawing('', anno);
        });
      
        anno.on('updateAnnotation', function(annotation) {
          enableDrawing('', anno);
        });

        anno.on('deleteAnnotation', function(annotation) {
          enableDrawing('', anno);
        });
      }
      // Tooltip Feature
      if (settings['withTooltip'] && ICONLABEL[toolId]){
        button.title=ICONLABEL[toolId];
      }
    }
  }
  if (settings['withMouse']){
    createButton('mouse', true);
    osdContainer('mouse');
  }
  const drawingTools = settings['drawingTools'] ? settings['drawingTools'].filter(elem => anno.listDrawingTools().indexOf(elem) != -1) : anno.listDrawingTools();
  drawingTools.forEach((toolId, idx) => {
    // In standard version, activate first button
    const activateFirst = !isOSDPlugin && idx === 0; 
    createButton(toolId, activateFirst);        
  });


  if (isOSDPlugin && !settings['withMouse']){
      anno.on('createSelection', clearActive);
  }
  container.appendChild(toolbar);
}

export default Toolbar;
