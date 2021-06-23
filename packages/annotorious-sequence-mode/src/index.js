const SequenceModePlugin = (anno, viewer) => {

  const pagedAnnotations = [];

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


  viewer.addHandler('page', ({page}) => {
    if (pagedAnnotations[page]) {
      anno.setAnnotations(Object.values(pagedAnnotations[page]))
    } else {
      anno.cancelSelected();
      anno.clearAnnotations();
    }
  });

}

export default SequenceModePlugin;