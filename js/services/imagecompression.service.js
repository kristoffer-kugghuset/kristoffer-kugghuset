'use strict'

let _resizedImage;

const resizedImages = {}

export const setResizedImage = (key, value) => {
  data[key] = value
}

export const getResizedImage = (key) => {
  return data[key]
}

function compressImage(origFile, index) {
  var MAX_WIDTH  = 800;
  var MAX_HEIGHT = 800;

  var reader = new FileReader();

  reader.addEventListener('load', function(event) {

    var origImg = new Image();
    origImg.src = event.target.result;

    origImg.addEventListener('load', function(event) {
      var width = event.target.width;
      var height = event.target.height;

      if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
        _resizedImage = origFile;
        console.log(origFile);
        return;
      }

      // Calc new dims otherwise

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      // Resize

      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(origImg, 0, 0, width, height);
      var resizedFile = base64ToFile(canvas.toDataURL(), origFile);
      _resizedImage = resizedFile;
      setResizedImage(index, _resizedImage);

      console.log("Orig");
      console.log(origFile);
      console.log("Resize");
      console.log(_resizedImage);

    });
  });

  reader.readAsDataURL(origFile);

}

function base64ToFile(dataURI, origFile) {
  var byteString, mimestring;

  if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = decodeURI(dataURI.split(',')[1]);
  }

  mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

  var content = new Array();
  for (var i = 0; i < byteString.length; i++) {
    content[i] = byteString.charCodeAt(i);
  }

  var newFile = new File(
    [new Uint8Array(content)], origFile.name, {type: mimestring}
  );


  // Copy props set by the dropzone in the original file

  var origProps = [ 
    "upload", "status", "previewElement", "previewTemplate" 
  ];

  $.each(origProps, function(i, p) {
    newFile[p] = origFile[p];
  });

  return newFile;
}

export default {
  compressImage: compressImage,
  setResizedImage: setResizedImage,
  getResizedImage: getResizedImage,
}