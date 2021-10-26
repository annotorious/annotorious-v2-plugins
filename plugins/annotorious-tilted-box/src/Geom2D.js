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

/** Rounds the vector coordinates to the given decimal placs **/
export const round = (vec, decimalPlaces) => {
  const factor = Math.pow(10, decimalPlaces || 0);
  return [
    Math.round(vec[0] * factor) / factor,
    Math.round(vec[1] * factor) / factor
  ];
}
/** Returns true if the vectors are equal **/
export const eq = (xy1, xy2) => 
  xy1[0] === xy2[0] && xy1[1] === xy2[1];

/** Normalizes a vector to length = 1 **/
export const normalize = xy => {
  var l = Math.max(len(xy), 0.00001); // Prevent div by zero
  return [ xy[0] / l, xy[1] / l ];
}

/** Computes the angle between two vectors **/
export const angleBetween = (a, b) => {
  const dotProduct = a[0] * b[0] + a[1] * b[1];
  return Math.acos(dotProduct);
}

export const angleOf = xy =>
  Math.atan2(xy[1], xy[0]);

/** Adds two vectors */
export const add = (a, b) =>
  [ a[0] + b[0], a[1] + b[1]  ];

export const mult = (vec, factor) =>
  [ factor * vec[0], factor * vec[1] ];
