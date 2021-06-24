const SequenceModePlugin = (anno, viewer, opts={}) => {

  const pagedAnnotations = [];
  const {initialAnnotations} = opts;

  const addOrUpdateAnnotationPages = (annotation) => {
    const currentPage = viewer.currentPage();

    if(!pagedAnnotations[currentPage]) {
      pagedAnnotations[currentPage] = {};
    }
    
    pagedAnnotations[currentPage][annotation.id] = annotation;
  };

  const removePagedAnnotation = (annotation) => {
    const currentPage = viewer.currentPage();
    delete pagedAnnotations[currentPage]?.[annotation.id]; 
  };
    
  anno.on('createAnnotation', addOrUpdateAnnotationPages);
  anno.on('updateAnnotation', addOrUpdateAnnotationPages);
  anno.on('deleteAnnotation', removePagedAnnotation);

  viewer.addHandler('open', () => {
    const tileSourceURL = viewer.world.getItemAt(0).source.url;
    const currentPage = viewer.currentPage();
    if(!pagedAnnotations[currentPage] && initialAnnotations?.[tileSourceURL]) {
      pagedAnnotations[currentPage] = {};
      initialAnnotations[tileSourceURL].forEach(annotation => {
        pagedAnnotations[currentPage][annotation.id] = annotation;
      });
    }
    anno.setAnnotations(Object.values(pagedAnnotations[currentPage]||{}));
  });


  viewer.addHandler('page', () => {
      anno.cancelSelected();
      anno.clearAnnotations();
  });

  anno.getAllAnnotations = () => {
    return pagedAnnotations
      .filter(val => !!val)
      .map(Object.values)
      .flat();
  };
};

export default SequenceModePlugin;