# Annotorious Better Polygon

A better polygon selection tool for [Annotorious](https://annotorious.com). Compatible with both
the Annotorious standard version and Annotorious for OpenSeadragon.

![Demo video](https://raw.githubusercontent.com/recogito/recogito-client-plugins/main/plugins/annotorious-better-polygon/screencast.gif)

## Features

- Close the polygon either by double clicking (or long tap), or re-selecting the first point
- When approaching the first point, the mouse will snap to it to make selecting easier
- Add points by clicking and dragging the line midpoint handles
- Remove points by selecting them with a click and pressing the DEL key
- Optionally start drawing by drag or single click

## Installation

__Better Polygon__ requires Annotorious version 2.5.9 or higher.

```html
<html>
  <head>
    <!-- Import Annotorious first -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.js"></script>

    <!-- Import the Better Polygon script -->
    <script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-better-polygon@latest/dist/annotorious-better-polygon.js"></script>
  </head>
  <body>
    <img id="hallstatt" src="640px-Hallstatt.jpg" />

    <script type="text/javascript">
      (function() {
        // Init Annotorious
        var anno = Annotorious.init({
          image: 'hallstatt'
        });

        // Init the plugin
        Annotorious.BetterPolygon(anno);
      })();
    </script>
  </body>
</html>
```

__Or via npm:__

```
$ npm i @recogito/annotorious-better-polygon
```

__Import and initialize:__

```js
import BetterPolygon from '@recogito/annotorious-better-polygon';

//...

BetterPolygon(anno);
```

