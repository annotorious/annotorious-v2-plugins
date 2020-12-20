// Firebase will auto-generate this config for you when you 
// create your app. Just paste your own settings in here.
var firebaseConfig = {
  apiKey: "-- your firebase api key here --",
  authDomain: "-- your authdomain here --",
  databaseURL: "-- your database url --",
  projectId: "-- your project id --",
  storageBucket: "-- your storage bucket --",
  messagingSenderId: "...",
  appId: "..."
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// Helper to find a Firebase doc by annotation ID
var findById = function(id) {
  var query = db.collection('annotations').where('id', '==', id);
  return query.get().then(function(querySnapshot) {
    return query.docs[0];
  });
}

window.onload = function() {
  var image = document.getElementById('my-image');
  var anno = Annotorious.init({ image });

  // Load annotations for this image
  db.collection('annotations').where('target.source', '==', image.src)
    .get().then(function(querySnapshot) {
      var annotations = querySnapshot.docs.map(function(doc) { 
        return doc.data(); 
      });

      anno.setAnnotations(annotations);
    });

  anno.on('createAnnotation', function(a) {
    db.collection('annotations').add(a).then(function() {
      console.log('Stored annotation');
    });
  });

  anno.on('updateAnnotation', function(annotation, previous) {
    findById(previous.id).then(function(doc) {
      doc.ref.update(annotation);
    });
  });

  anno.on('deleteAnnotation', function(annotation) {
    findById(annotation.id).then(function(doc) {
      doc.ref.delete();
    });
  });
}