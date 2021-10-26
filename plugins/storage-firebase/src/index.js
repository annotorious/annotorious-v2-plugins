const FirebaseStorage = (client, firebaseConfig, settings) => {

  const collectionName = settings.collectionName || 'annotations';
  const { annotationTarget } = settings;

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  // Helper to find a Firebase doc by annotation ID
  const findById = id => {
    const query = db.collection(collectionName).where('id', '==', id);
    return query.get().then(querySnapshot => {
      return querySnapshot.docs[0]
    });
  }

  // Load annotations for this image
  db.collection(collectionName).where('target.source', '==', annotationTarget)
    .get().then(querySnapshot => {
      const annotations = querySnapshot.docs.map(function(doc) { 
        return doc.data(); 
      });

      client.setAnnotations(annotations);
    });

  // Lifecycle event handlers
  client.on('createAnnotation', a => {
    db.collection(collectionName)
      .add(a).catch(error => 
        console.error('Error storing annotation', error, a))
  });

  client.on('updateAnnotation', (annotation, previous) => {
    findById(previous.id)
      .then(doc => doc.ref.update(annotation))
      .catch(error => console.log('Error updating annotation', error, previous, annotation))
  });

  client.on('deleteAnnotation', annotation => {
    findById(annotation.id)
      .then(doc => doc.ref.delete())
      .catch(error => console.log('Error deleting annotation', error, annotation));
  });

}

export default FirebaseStorage;
