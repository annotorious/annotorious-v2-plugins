/** Computes the length of a vector **/
export const len = (xy1, xy2) => 
  xy2 ? 
    // Treat input as two vectors and compute length of result vector
    Math.sqrt(Math.pow(xy2[0] - xy1[0], 2) + Math.pow(xy2[1] - xy1[1], 2)) :

    // Treat input as a vector
    Math.sqrt(Math.pow(xy1[0], 2) + Math.pow(xy1[1], 2));

/** Returns the vector between two points **/
export const vec = (terminal, starting) => 
  [ terminal[0] - starting[0], terminal[1] - starting [1] ];

/** Normalizes a vector to length = 1 **/
export const normalize = xy => {
  var l = len(xy);
  return [ xy[0] / l, xy[1] / l ];
}

/** Computes the angle between two vectors **/
export const angleBetween = (a, b) => {
  const dotProduct = a[0] * b[0] + a[1] * b[1];
  return Math.acos(dotProduct);
}

/** Adds two vectors */
export const add = (a, b) =>
  [ a[0] + b[0], a[1] + b[1]  ];
