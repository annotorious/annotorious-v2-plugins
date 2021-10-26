export const svgPolygonToLegacy = selector =>
  `svg.polygon:${selector.value}`;

export const tiltedBoxToLegacy = selector =>
  `svg.tbox:${selector.value}`;

export const legacyPolygonToSelector = anchor => ({
  type: 'SvgSelector',
  value: anchor.split(':')[1]  
});