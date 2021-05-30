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
  
  src.delete(); 
  dst.delete(); 
  
  hierarchy.delete(); 
  contours.delete(); 
  polygons.delete();

  return chunk(largestAreaPolygon.polygon.data32S, 2);
}

const FindContours = anno => {

  anno.on('createSelection', async function(selection) {
    const { snippet, transform } = anno.getSelectedImageSnippet();

    const localCoords = findContourPolygon(snippet);
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