# Recogito Client Plugins

Plugins for the [RecogitoJS](https://github.com/recogito/recogito-js), 
[Annotorious](https://github.com/recogito/annotorious) and 
[Annotorious OpenSeadragon](https://github.com/recogito/annotorious-openseadragon) JavaScript
annotation libraries.

## Storage Plugins

Attach different annotation storage backends to RecogitoJS, Annotorious 
or AnnotoriousOSD.

- [Firebase Storage](https://github.com/recogito/recogito-plugins-common/tree/main/packages/storage-firebase). 
  A storage plugin that uses Google Firebase as a cloud annotation store. 
- [Recogito Legacy Platform Storage](https://github.com/recogito/recogito-plugins-common/tree/main/packages/storage-legacy-platform). 
  A storage plugin that enables RecogitoJS/Annotorious to work inside the legacy 
  [Pelagios Recogito annotation platform](https://recogito.pelagios.org).

<br>

## Editor Widgets

Extend the editor popup with additional UI components, or replace the existing components. Compatible 
with RecogitoJS, Annotorious and AnnotoriousOSD.

- Gazetteer Resolution __work in progress__
- Tag Validation __work in progress__

<br>

## Image Annotation Plugins

Compatible with Annotorious and Annotorious OSD.

- Smart Tagging. An AI-based helper that assigns tags to image selections automatically, after learning
  from a few manually assigned examples, using Transfer Learning and MobileNet. __work in progress__
- Select Contours __work in progress__
- Smart Segmentation __work in progress__
