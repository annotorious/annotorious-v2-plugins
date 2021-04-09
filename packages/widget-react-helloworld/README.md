# An Example React Editor Widget

The example React widget from the [guide](https://recogito.github.io/guides/editor-widgets/).

## Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Load Annotorious first -->
    <link href="/annotorious.min.css" rel="stylesheet">
    <script src="/annotorious.min.js"></script>

    <!-- Load plugin script next -->
    <script src="recogito-helloworld-widget.js"></script>
  </head>
  <body>
    <img id="hallstatt" src="640px-Hallstatt.jpg" />

    <script type="text/javascript">
      (function() {

        // Add plugin to the widgets on init
        var anno = Annotorious.init({
          image: 'hallstatt',
          widgets: [ 
            recogito.HelloWorldWidget,
            'COMMENT',
            'TAG'
          ]
        });
        
      })();
    </script>
  </body>
</html>
```