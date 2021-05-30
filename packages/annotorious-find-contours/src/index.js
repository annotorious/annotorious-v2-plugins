/*************************************************************************
 * 
 * Basic concept for this is from the official OpenCV docs: 
 * https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
 * 
 *************************************************************************/

/**
 * Helper: chunks an array (i.e array to array of arrays)	
 */
 const chunk = (array, size) => {	
  const chunked_arr = [];	

  let index = 0;	
  while (index < array.length) {	
    chunked_arr.push(array.slice(index, size + index));	
    index += size;	
  }	

  return chunked_arr;	
}

/**
 * Renders intermediate OpenCV results into a 'debug DIV'
 */
const renderDebugImages = (canvasInput, src, polygons, hierarchy, div) => {
  const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

  const color = new cv.Scalar(
    Math.round(Math.random() * 255), 
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255));

  cv.drawContours(dst, polygons, -1, color, 1, 8, hierarchy, 0);

  const mask = document.createElement('CANVAS');
  mask.width = canvasInput.width;
  mask.height = canvasInput.height;
  cv.imshow(mask, src);

  div.appendChild(mask);

  const output = document.createElement('CANVAS');
  output.width = canvasInput.width;
  output.height = canvasInput.height;
  cv.imshow(output, dst);
  
  div.appendChild(output);

  dst.delete(); 
}

/**
 * Computer vision magic happens here
 */
const findContourPolygon = (canvasInput, debugDiv) => {
  const src = cv.imread(canvasInput);

  // Convert to grayscale & threshold
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
  cv.threshold(src, src, 120, 200, cv.THRESH_BINARY + cv.THRESH_OTSU);

  // Find contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let poly = new cv.MatVector();

  for (let i = 0; i < contours.size(); ++i) {
    let tmp = new cv.Mat();
    let cnt = contours.get(i);
    // You can try more different parameters
    cv.convexHull(cnt, tmp, false, true);
    poly.push_back(tmp);
    cnt.delete(); tmp.delete();
  }

  // draw contours with random Scalar
  const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                            Math.round(Math.random() * 255));
    cv.drawContours(dst, poly, i, color, 1, 8, hierarchy, 0);
  }
  
  const output = document.createElement('CANVAS');
  output.width = canvasInput.width;
  output.height = canvasInput.height;
  cv.imshow(output, dst);
  debugDiv.appendChild(output);

  src.delete(); dst.delete(); hierarchy.delete(); contours.delete(); poly.delete();

  /*
  const dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  for (let i = 0; i < contours.size(); ++i) {
    let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                              Math.round(Math.random() * 255));
    cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
  }


  */

  // Approximate closed polygons, keep only the largest
  // let largestAreaPolygon = { area: 0 };

  /*
  const polygons = new cv.MatVector();

  for (let i = 0; i < contours.size(); ++i) {
    const polygon = new cv.Mat();
    const contour = contours.get(i);
    
    cv.approxPolyDP(contour, polygon, 3, true);

    // polygons.push_back(polygon);

    //  Compute contour areas
    const area = cv.contourArea(polygon);

    // if (area > largestAreaPolygon.area)
    largestAreaPolygon = { area, polygon };

    // contour.delete(); 
    // polygon.delete();
  }

  polygons.push_back(largestAreaPolygon.polygon);
  
  // if (debugDiv)
   // renderDebugImages(canvasInput, src, polygons, hierarchy,debugDiv);

  src.delete(); 
  
  hierarchy.delete(); 
  contours.delete(); 
  polygons.delete();
  */

  // return chunk(largestAreaPolygon.polygon.data32S, 2);
}

const FindContours = (anno, debugDiv) => {

  anno.on('createSelection', async function() {
    const { snippet, transform } = anno.getSelectedImageSnippet();

    const localCoords = findContourPolygon(snippet, debugDiv);
    const coords = localCoords.map(xy => transform(xy));

    const annotation = {
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
    }

    setTimeout(function() {
      anno.setAnnotations([ annotation ]);
      anno.selectAnnotation(annotation);  
    }, 10);
  });

}

export default FindContours;