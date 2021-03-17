# Annotorious Tilted Box Plugin

This plugin for [Annotorious](https://github.com/recogito/annotorious) adds a new 
selection tool: the __Tilted Box__.

![Example screen capture](screencap.gif)

The Tilted Box allows you to quickly draw a rectangle in an arbitrary rotation.
This can be especially useful for selecting text that appears in photographs or
digitized map images.

__!!! BETA !!!__ the current version support __creating__ annotations only. You 
can not (yet) edit existing shapes.

## Install

Include the plugin directly via the CDN:

```html
<!-- Annotorious -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.css">
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.js"></script>

<!-- Tilted box plugin -->
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-tilted-box@latest/dist/annotorious-tilted-box.min.js"></script>
```

Or if you are using npm:

``` 
$ npm install @recogito/annotorious-tilted-box
```

Instantiate Annotorious the normal way, and then register the plugin:

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

Questions? Feedack? Feature requests? Join the [Annotorious chat on Gitter](https://gitter.im/recogito/annotorious).

[![Join the chat at https://gitter.im/recogito/annotorious](https://badges.gitter.im/recogito/annotorious.svg)](https://gitter.im/recogito/annotorious?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## License

[BSD-3 Clause](https://github.com/recogito/recogito-client-plugins/blob/main/packages/annotorious-tilted-box/LICENSE) (= feel 
free to use this code in whatever way you wish. But keep the attribution/license file, 
and if this code breaks something, don't complain to us :-)





