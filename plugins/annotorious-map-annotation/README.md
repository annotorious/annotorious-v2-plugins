# Annotorious Map Annotation

A helper plugin for using Annotorious with maps and geo-referenced images. After the 
plugin is installed, annotation shapes will use geographic coordinates (latitude, longitude)
rather than image pixel coordinates.

This plugin currently works with [Annotorious OpenSeadragon](https://github.com/recogito/annotorious-openseadragon)
and WMTS maps __only__.

The plugin depends on:
- [OpenSeadragon](https://openseadragon.github.io/)
- [Annotorious OpenSeadragon](https://github.com/recogito/annotorious-openseadragon)
- [OpenSeadragon WTMS plugin](https://github.com/recogito/openseadragon-wmts)

## Installing
`npm install @recogito/annotorious-map-annotation`

or 

```html
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-map-annotation@latest/dist/annotorious-map-annotation.js"></script>
```

## Using

```js
// OpenSeadragon viewer
var viewer = OpenSeadragon({
  id: "openseadragon",
  prefixUrl: "openseadragon/images/"
});

// OpenSeadragon WMTS plugin
var map = await OpenSeadragon.WMTS(viewer, {
  url: 'http://maps.wien.gv.at/wmts/1.0.0/WMTSCapabilities.xml'
});

// Initialize Annotorious
var anno = OpenSeadragon.Annotorious(viewer);

// Add the map annotation plugin
Annotorious.MapAnnotation(anno, map);
```