import * as Annotorious from '@recogito/annotorious-openseadragon';
import * as MobileNet from '@tensorflow-models/mobilenet';
import * as KNNClassifier from '@tensorflow-models/knn-classifier';
import OpenSeadragon from 'openseadragon';

import '@tensorflow/tfjs';

import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

const getSnippet = (viewer, annotation) => {
  const { canvas } = viewer.drawer;
  const osdWidth = canvas.width;
  const osdHeight = canvas.height;

  const osdBounds = canvas.getBoundingClientRect();
  const kx = osdWidth / osdBounds.width;
  const ky = osdHeight / osdBounds.height;

  // TODO works only for Selection, not Annotation
  const svgEl = document.querySelector(`svg.a9s-annotationlayer .a9s-selection`);
  const { x, y, width, height } = svgEl.getBoundingClientRect();

  const sourceSnippet = canvas.getContext('2d').getImageData(x * kx, y * ky, width * kx, height * ky);

  // Parse fragment selector (image coordinates)
  /* TODO what about polygons? Need a generic way to get bounds?
  const [ xi, yi, wi, hi ] = annotation.target.selector.value
    .split(':')[1]
    .split(',')
    .map(str => parseFloat(str));

  // Convert image coordinates (=annotation) to viewport coordinates (=OpenSeadragon canvas)
  const topLeft = viewer.viewport.imageToWindowCoordinates(new OpenSeadragon.Point(xi, yi));
  const bottomRight =  viewer.viewport.imageToWindowCoordinates(new OpenSeadragon.Point(xi + wi, yi + hi));

  const { x, y } = topLeft;
  const w = bottomRight.x - x;
  const h = bottomRight.y - y;
  */

  // Cut out the image snippet
  const buffer = document.createElement('CANVAS');
  const ctx = buffer.getContext('2d');
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.putImageData(sourceSnippet, 0, 0);

  return buffer;
}

(async function() {
  const viewer = OpenSeadragon({
    id: "openseadragon",
    prefixUrl: "/osd/",
    tileSources: {
      type: "image",

      // Attribution: Carta Marina by Olaus Magnus (1539)
      // https://commons.wikimedia.org/wiki/File:Carta_Marina.jpeg
      url: "/Carta_Marina.jpeg" 
    }
  });

  // Initialize the Annotorious plugin
  var anno = Annotorious(viewer, {
    widgets: [ 'TAG' ]
  });

  console.log('Loading MobileNet');
  console.time('MobileNet loaded');
  const mnet = await MobileNet.load();
  console.timeEnd('MobileNet loaded');

  const classifier = KNNClassifier.create();

  // When the user creates a new selection, we'll classify the snippet
  anno.on('createSelection', async function(selection) {
    const snippet = getSnippet(viewer, selection);
    console.log(snippet);
    document.getElementById('previews').appendChild(snippet);

    if (classifier.getNumClasses() > 1) {
      const activation = mnet.infer(snippet, 'conv_preds');
      const result = await classifier.predictClass(activation);

      if (result) {
        // Inject into the current annotation
        selection.body = [{
          type: 'TextualBody',
          purpose: 'tagging',
          value: result.label
        }]

        anno.updateSelected(selection);
      }
    }
  });

  // When the user hits 'Ok', we'll store the snippet as a new example
  anno.on('createAnnotation', function(annotation) {
    const snippet = getSnippet(viewer, annotation);
    const tag = annotation.body.find(b => b.purpose === 'tagging').value;

    // See https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab/index.html#6
    const activation = mnet.infer(snippet, true);
    classifier.addExample(activation, tag);
  });
})();