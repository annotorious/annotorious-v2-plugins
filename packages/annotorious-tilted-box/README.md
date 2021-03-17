# Annotorious Tilted Box Plugin

This plugin adds a new selection tool: the __Tilted Box__.

![Example screen capture](screencap.gif)

## Install

```html
<!-- Annotorious -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.css">
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.js"></script>

<!-- Tilted box plugin -->
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-tilted-box@latest/dist/annotorious-tilted-box.min.js"></script>
```

```js
var anno = Annotorious.init({
  image: 'my-image'
});

// Init the plugin
Annotorious.TiltedBox(anno);

// Annotorious now has an additional drawing 
// tool - set it as the active tool
anno.setDrawingTool('annotorious-tilted-box');
```


