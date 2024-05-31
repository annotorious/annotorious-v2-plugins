# Annotorious Sequence Mode Plugin

A helper to simplify the use of Annotorious with OpenSeadragon Sequence Mode.

Contributed by [Umesh Timalsina](https://github.com/umesh-timalsina).

## Run in development mode

```sh
$ npm install
$ npm start
```

## Build from source

```sh
$ npm run build
```


## Methods

The SequenceModePlugin adds new functionality to the Annotorious library specifically for handling annotations in a sequence or paged viewer mode. 

1. `addOrUpdateAnnotationPages(annotation)`: This method is triggered when an annotation is created or updated. It adds or updates the annotation in the `pagedAnnotations` array based on the current page of the viewer. This allows annotations to be associated with specific pages.

2. `removePagedAnnotation(annotation)`: This method is triggered when an annotation is deleted. It removes the annotation from the `pagedAnnotations` array for the current page.

3. `viewer.addHandler('open', ...)`: This handler is triggered when the viewer is opened. It checks if there are any initial annotations provided for the current tile source URL and page. If found, it adds those annotations to the `pagedAnnotations` array for the current page and sets them as the active annotations.

4. `viewer.addHandler('page', ...)`: This handler is triggered when the viewer navigates to a different page. It cancels any selected annotation and clears the current annotations, preparing for the annotations of the new page.

5. `anno.getAllAnnotations()`: This new method returns all annotations across all pages. It filters out any empty pages and flattens the annotations into a single array.

Here's an example of how these new methods can be used:

```javascript
const viewer = OpenSeadragon({...});
const anno = Annotorious(viewer);

// Initialize the SequenceModePlugin with initial annotations
const initialAnnotations = {
  'http://example.com/image1.jpg': [
    {id: 'anno1', ...},
    {id: 'anno2', ...}
  ],
  'http://example.com/image2.jpg': [
    {id: 'anno3', ...},
    {id: 'anno4', ...}
  ]
};

SequenceModePlugin(anno, viewer, {initialAnnotations});

// Navigate to a specific page
viewer.goToPage(1);

// Get all annotations across all pages
const allAnnotations = anno.getAllAnnotations();
```

In this example, the SequenceModePlugin is initialized with `initialAnnotations` that define annotations for specific tile source URLs (representing different pages or images). When the viewer navigates to a specific page using `viewer.goToPage()`, the plugin automatically loads and sets the annotations for that page.

The `anno.getAllAnnotations()` method can be used to retrieve all annotations across all pages, which can be useful for saving or exporting the annotations.

 "if you create annotations on a (single) image, and then later use the same image in a multi-image display, then the annotations will not be placed correctly." -rsimon
