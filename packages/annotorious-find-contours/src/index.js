/*************************************************************************
 * 
 * Basic concept for this is from the official OpenCV docs: 
 * https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
 * 
 *************************************************************************/

// Helper: chunks an array (i.e array to array of arrays)	
 const chunk = (array, size) => {	
  const chunked_arr = [];	

  let index = 0;	
  while (index < array.length) {	
    chunked_arr.push(array.slice(index, size + index));	
    index += size;	
  }	

  return chunked_arr;	
}

// Helper: creates a dummy polygon annotation from the given coords 
const toAnnotation = coords => ({
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "id": "#a88b22d0-6106-4872-9435-c78b5e89fede",
  "type": "Annotation",
  "body": [],
  "target": {
    "selector": [{
      "type": "SvgSelector",
      "value": `<svg><polygon points='${coords.map(xy => xy.join(',')).join(' ')}'></polygon></svg>`
    }]
  }
});

/**
 * Cuts the selected image snippet from the OpenSeadragon CANVAS element.
 */
const getSnippet = (viewer, annotation) => {
  // Scale factor for OSD canvas element (physical vs. logical resolution)
  const { canvas } = viewer.drawer;
  const canvasBounds = canvas.getBoundingClientRect();
  const kx = canvas.width / canvasBounds.width;
  const ky = canvas.height / canvasBounds.height;

  // Parse fragment selector (image coordinates)
  // WARNING: a hack that STRICTLY assumes a box selection
  // from Annotorious (will break for polygon selections)
  const [ xi, yi, wi, hi ] = annotation.target.selector.value
    .split(':')[1]
    .split(',')
    .map(str => parseFloat(str));

  // Convert image coordinates (=annotation) to viewport coordinates (=OpenSeadragon canvas)
  const topLeft = viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(xi, yi));
  const bottomRight =  viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(xi + wi, yi + hi));

  const { x, y } = topLeft;
  const w = bottomRight.x - x;
  const h = bottomRight.y - y;

  // Cut out the image snippet as in-memory canvas element
  const snippet = document.createElement('CANVAS');
  const ctx = snippet.getContext('2d');
  snippet.width = w;
  snippet.height = h;
  ctx.drawImage(canvas, x * kx, y * ky, w * kx, h * ky, 0, 0, w * kx, h * ky);

  // Return snippet canvas + basic properties useful for downstream coord translation
  return { snippet, kx, ky, x: xi, y: yi };
}

/**
 * Computer vision magic happens here
 */
const findContourPolygon = canvasInput => {
  const src = cv.imread(canvasInput);
  const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

  // Convert to grayscale & threshold
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
  cv.threshold(src, src, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

  // Find contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_NONE); // CV_RETR_EXTERNAL

  // Approximate closed polygons, keep only the largest
  let largestAreaPolygon = { area: 0 };

  for (let i = 0; i < contours.size(); ++i) {
    const polygon = new cv.Mat();
    const contour = contours.get(i);
    
    cv.approxPolyDP(contour, polygon, 3, true);

    // Compute contour areas
    const area = cv.contourArea(polygon);
    if (area > largestAreaPolygon.area)
      largestAreaPolygon = { area, polygon };

    contour.delete(); 

    // TODO potential memory leak - we should also delete the other polygons,
    // but hey, it's a quick hack
  }

  const polygons = new cv.MatVector();
  polygons.push_back(largestAreaPolygon.polygon);

  // Uncomment if you want to render the intermediate results to the screen
  /*
  let color = new cv.Scalar(
    Math.round(Math.random() * 255), 
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255));
  cv.drawContours(dst, polygons, -1, color, 1, 8, hierarchy, 0);
  const mask = document.createElement('CANVAS');
  mask.width = canvasInput.width;
  mask.height = canvasInput.height;
  cv.imshow(mask, src);
  document.getElementById('previews').appendChild(mask);
  const output = document.createElement('CANVAS');
  output.width = canvasInput.width;
  output.height = canvasInput.height;
  cv.imshow(output, dst);
  
  document.getElementById('previews').appendChild(output);
  */
  
  src.delete(); 
  dst.delete(); 
  
  hierarchy.delete(); 
  contours.delete(); 
  polygons.delete();

  return chunk(largestAreaPolygon.polygon.data32S, 2);
}

const FindContours = anno => {

  // On selection: cut snippet, find contours, update the annotation
  anno.on('createSelection', async function(selection) {
    // Extract the image snippet, recording
    // - image snippet (as canvas element)
    // - x/y coordinate of the snippet top-left (image coordinate space)
    // - kx/ky scale factors between canvas element physical and logical dimensions 
    const { snippet, x, y, kx, ky } = getSnippet(viewer, selection);

    // Current image zoom from OSD
    const imageZoom = viewer.viewport.viewportToImageZoom(viewer.viewport.getZoom()); 

    // Polygon coordinates, in the snippet element's logical coordinate space
    const localCoords = findContourPolygon(snippet);
    
    // Translate to image coordinate space
    const coords = localCoords.map(xy => {
      const px = x + (xy[0] / kx) / imageZoom;
      const py = y + (xy[1] / ky) / imageZoom;
      return [ px, py ];
    });

    // Turn coords to W3C WebAnnotation
    const annotation = toAnnotation(coords);

    // Add the new annotation in Annotorious and select 
    // it (replacing the current user selection)
    setTimeout(function() {
      anno.setAnnotations([ annotation ]);
      anno.selectAnnotation(annotation);  
    }, 10);
  });

}

export default FindContours;