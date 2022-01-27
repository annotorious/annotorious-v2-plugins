import { forward, reverse } from './crosswalk';

const MapAnnotationPlugin = (anno, map) => {

  // Keep a list of handlers and their wrapped counterparts,
  // so we can remove them using .off
  const handlers = [];

  // Forward and reverse crosswalks
  const fwd = forward(map);
  const rvs = reverse(map);

  // Monkey-patch API methods for getting and setting annotations
  const _addAnnotation = anno.addAnnotation;
  const _setAnnotations = anno.setAnnotations;
  const _getAnnotations = anno.getAnnotations;
  const _getAnnotationById = anno.getAnnotationById;

  anno.addAnnotation = (annotation, readOnly) => {
    const crosswalked = fwd(annotation);
    _addAnnotation(crosswalked, readOnly);
  }

  anno.setAnnotations = annotations => {
    const crosswalked = annotations.map(a => fwd(a));
    _setAnnotations(crosswalked);
  }

  anno.getAnnotations = () =>
    _getAnnotations().map(a => rvs(a)); 

  anno.getAnnotationById = (id, skipCrosswalk) => {
    if (skipCrosswalk)
      return _getAnnotationById(id);

    const a = _getAnnotationById(id);
    return a ? rvs(a) : null;
  }

  // Monkey patch .on and .once 
  const STANDARD_EVENTS = new Set([
    'cancelSelected',
    'clickAnnotation',
    'createSelection',
    'deleteAnnotation',
    'mouseEnterAnnotation',
    'mouseLeaveAnnotation',
    'selectAnnotation'
  ]);

  const wrapHandler = origHandler => (event, handler) => {
    let wrapped;

    if (STANDARD_EVENTS.has(event)) {
      wrapped = (a, arg) => handler(rvs(a), arg);
    } else if (event === 'createAnnotation') {
      wrapped = (a, overrideId) => handler(rvs(a), overrideId);
    } else if (event === 'updateAnnotation') {
      // updateAnnotation has two annotations as argument
      wrapped = (a, p) => handler(rvs(a), rvs(p));
    } else if (event === 'changeSelectionTarget') {
      wrapped = target => { 
        // Crosswalks expect an object with a 'target'
        const wrapper = { target };
        handler(rvs(wrapper));
      };
    } else if (event === 'startSelection') {
      // TODO startSelection(point)
      throw 'startSelection event is not yet supported by the map annotation plugin';
    }

    if (wrapped) {
      // Keep a reference, so we can remove later
      handlers.push({ handler, wrapped });

      origHandler(event, wrapped);
    }
  }

  anno.on = wrapHandler(anno.on);
  anno.once = wrapHandler(anno.once);

  // Monkey-patch .off
  const _off = anno.off;

  anno.off = (event, optCallback) => {
    if (optCallback) {
      const t = handlers.find(({ handler }) => handler === optCallback);
      if (t)
        _off(event, t.wrapped);
    } else {
      _off(event);
    }
  }
  
}

export default MapAnnotationPlugin;
