const FirebaseStorage = (client, config) => {

  firebase.initializeApp(config);

  const db = firebase.firestore();

  // Helper to find a Firebase doc by annotation ID
  const findById = id => {
    const query = db.collection('annotations').where('id', '==', id);
    return query.get().then(querySnapshot => query.docs[0]);
  }

  // Load annotations for this image
  db.collection('annotations').where('target.source', '==', image.src)
    .get().then(querySnapshot => {
      const annotations = querySnapshot.docs.map(function(doc) { 
        return doc.data(); 
      });

      client.setAnnotations(annotations);
    });

  // Lifecycle event handlers
  client.on('createAnnotation', a => {
    db.collection('annotations')
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
