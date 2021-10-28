# Annotorious Shape Labels

A plugin for Annotorious and Annotorious OpenSeadragon that adds a the first tag as a label
to the  annotation shape.

![Example screenshot](https://raw.githubusercontent.com/recogito/recogito-client-plugins/main/plugins/annotorious-shape-labels/screenshot.jpg)

## Install

Download the [latest minified release](https://github.com/recogito/recogito-client-plugins/blob/main/plugins/annotorious-shape-labels/dist/annotorious-shape-labels.min.js) or include directly via CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-shape-labels@latest/dist/annotorious-shape-labels.min.js"></script>
```

Import via npm:

```sh
npm install @recogito/annotorious-shape-labels
```

## Use

```html
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@recogito/annotorious@latest/dist/annotorious.min.js"></script>
    <script src="annotorious-shape-labels.min.js"></script>
  </head>
  <body>
    <img id="hallstatt" src="640px-Hallstatt.jpg" />

    <script type="text/javascript">
      (function() {
        var anno = Annotorious.init({
          image: 'hallstatt',

          // Add the formatter provided by the plugin
          formatter: Annotorious.ShapeLabelsFormatter()
        });
      })();
    </script>
  </body>
</html>
```

## CSS Styling

The label is inserted into the SVG annotation group as a `foreignObject` element. In addition, 
the plugin adds the first tag as an extra CSS class to the annotation shape.

To apply your own CSS styles, follow this structure:

```svg
<g class="a9s-annotation FirstTagValue">

  <!-- annotation shapes -->
  
  <svg class="a9s-formatter-el">
    <foreignObject>
      <div xmlns="http://www.w3.org/1999/xhtml" class="a9s-shape-label">
        FirstTagValue
      </div>
    </foreignObject>
  </svg>
</g>
```