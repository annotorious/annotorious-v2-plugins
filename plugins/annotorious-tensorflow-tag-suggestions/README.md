# Annotorious Tensorflow Tag Suggestions

A plugin that adds AI-powered automatic tag suggestions to Annotorious and Annotorious OpenSeadragon. Tag image regions manually first. 
After learning from at least two examples, the plugin provides tag suggestions automatically. Uses Transfer Learning in 
[Tensorflow.js](https://www.tensorflow.org/js) on top of the MobileNet image classifier. Based on this example:

https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab/index.html#6

![Animated screenshot](https://raw.githubusercontent.com/recogito/recogito-client-plugins/main/plugins/annotorious-tensorflow-tag-suggestions/screenshot.gif)

## Installation

Install via npm 

```sh
npm install @recogito/annotorious-tensorflow-tag-suggestions
```

or include in the page

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@recogito/annotorious-tensorflow-tag-suggestions@latest/dist/annotorious-tf-tag-suggestions.min.js"></script>
```

## Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Annotorious Smart Tagging Demo</title>
    <script src="openseadragon-bin-2.4.2/openseadragon.min.js"></script>
    <script src="openseadragon-annotorious.min.js"></script>
    <script src="annotorious-tf-tag-suggestions.min.js"></script>
    <link rel="stylesheet" href="annotorious.min.css">
  </head>
  <body>
    <div id="osd-image"></div>

    <script type="text/javascript">
      (function() {
        // Initialize OpenSeadragon
        var viewer = OpenSeadragon({
          id: "osd-image",
          tileSources: {
            type: "image",
            url: "my-image.jpeg" 
          }
        });

        // Initialize Annotorious
        var anno = OpenSeadragon.Annotorious(viewer, {
          widgets: [ 'TAG' ]
        });

        // Initialize the smart tagging plugin
        recogito.AnnotoriousTFSuggestions(anno);
      })();
    </script>
  </body>
</html>
```
