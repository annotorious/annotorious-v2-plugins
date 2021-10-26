# Firebase Storage

A storage plugin for RecogitoJS and Annotorious/AnnotoriousOSD that uses
Google Firebase as annotation store.

## Installation

Install via npm 

```sh
npm install @recogito/firebase-storage
```

or include in the page

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@recogito/firebase-storage@latest/dist/recogito-firebase-storage.js"></script>
```

## Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>RecogitoJS/Annotorious Firebase Storage Adapter</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@recogito/annotorious@2.1.6/dist/annotorious.min.css">
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-firestore.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious@2.1.6/dist/annotorious.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@recogito/firebase-storage@latest/dist/recogito-firebase-storage.min.js"></script>
  </head>
  <body>
    <img id="my-image" src="https://raw.githubusercontent.com/recogito/annotorious/master/public/640px-Hallstatt.jpg">
    
    <script>
      (function() {
        var image = document.getElementById('my-image');
        var anno = Annotorious.init({ image });

        // Firebase will auto-generate this config for you when you 
        // create your app. Just paste your own settings in here.
        var firebaseConfig = {
          apiKey:        "-- your firebase api key here --",
          authDomain:    "-- your authdomain here --",
          databaseURL:   "-- your database url --",
          projectId:     "-- your project id --",
          storageBucket: "-- your storage bucket --",
          messagingSenderId: "...",
          appId: "..."
        };

        var settings = {
          annotationTarget: image.src,  // mandatory
          collectionName: 'annotations' // optional (default = 'annotations')
        }

        recogito.FirebaseStorage(anno, firebaseConfig, settings);
      })();
    </script>
  </body>
</html>
```

