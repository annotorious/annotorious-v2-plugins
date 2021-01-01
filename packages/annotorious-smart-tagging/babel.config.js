module.exports = {
  sourceMaps: true,
  presets: [
    [ "@babel/preset-env", {
      "forceAllTransforms": true,
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
};