import * as deeplab from '@tensorflow-models/deeplab';

const segment = async (canvas, model) => {
  console.time("segmenting");
  const segments = await model.segment(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height));
  console.timeEnd("segmenting");

  const mask = new ImageData(segments.segmentationMap, segments.width, segments.height);
  console.log(segments);

  const canvas2 = document.createElement('canvas');
  canvas2.width = segments.width;
  canvas2.height = segments.height
  const ctx = canvas2.getContext("2d");
  ctx.putImageData(mask, 0, 0);

  document.getElementById('app').appendChild(canvas2);
}

const TFSegment = anno => {

  // Set to your preferred model: 'pascal', 'cityscapes' or 'ade20k'
  console.time("loading segmentation model");
  deeplab.load({ base: "pascal", quantizationBytes: 4 }).then(model => {
    console.timeEnd("loading segmentation model");
    
    const image = document.getElementById('image');
    const anno =  new Annotorious({ image });

    let canvas;

    anno.on('createSelection', selection => {
      // Parse fragment selector
      const [ x, y, w, h ] = selection.target.selector.value
        .split(':')[1]
        .split(',')
        .map(str => parseFloat(str));

      // Read selected image data
      requestAnimationFrame(() => {
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = w;
        ctx.canvas.height = h;
        ctx.drawImage(image, x, y, w, h, 0, 0, w, h);

        document.getElementById('app').appendChild(canvas);
      });

      requestAnimationFrame(() => segment(canvas, model));
    });
  });

}

export default TFSegment;