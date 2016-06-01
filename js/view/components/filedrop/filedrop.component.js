'use strict'

import Dropzone from 'Dropzone'
import Vue from 'vue';

import template from './filedrop.template.html';
import previewTemplate from './filedrop.previewTemplate.html'

import utils from '../../../services/utils';
import state from '../../../services/state.service';
import auth from '../../../services/auth.service';
import config from '../../../config';

Dropzone.autoDiscover = false;

const FileDrop = Vue.extend({
  template,
  props: {
    uploadPhotos: {
      type: Function,
    },
  },

  events: {
    'lead_submit_response': function(data) {
      if(this.dropzone.files.length > 0) {
        this.dropzone.options.url = this.dropzone.options.url + data.id;
        this.dropzone.processQueue();        
      } else {
        this.$dispatch('uploaded', "No images")
      };
    }
  },

  methods: {
    onUploadComplete: function(file) {
      let _response = {
        body: utils.jsonParseOrValue(file.xhr.response),
        statusCode: file.xhr.status,
        status: file.xhr.statusText,
      };
      state.setItem('fileUpload',_response.body);
      this.$dispatch('uploaded', _response.body)
    }
  },

  ready: function () {
    // When the elemenet is loaded, apply the dropzone part.
    this.dropzone = new Dropzone(this.$el, { 
      url: config.baseUrl + '/services/salesforce/leads/file/',
      maxFiles: 3,
      thumbnailWidth: null,
      thumbnailHeight: 160,
      previewsContainer: '#previews',
      previewTemplate: previewTemplate,
      uploadMultiple: true,
      autoProcessQueue: false,
      acceptedFiles: "image/*",
      clickable: '.preview-box',
      headers: auth.getHeaders(),
      parallelUploads: 3,
      init: function () {
        var dropzone = this;

        this.on("addedfile", function (file) {

          var origFile = file;
          var reader = new FileReader();
          console.log(this);

          reader.addEventListener("load", function(event) {

            var origImg = new Image();
            origImg.src = event.target.result;
            var MAX_WIDTH  = 800;
            var MAX_HEIGHT = 600;

            origImg.addEventListener("load", function(event) {

              var width  = event.target.width;
              var height = event.target.height;


              // Don't resize if it's small enough

              if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
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


              // Replace original with resized

              var origFileIndex = dropzone.files.indexOf(origFile);
              dropzone.files[origFileIndex] = resizedFile;

            });
          });

          reader.readAsDataURL(origFile);


          if (this.files.length > 3) {
              this.removeFile(this.files[0]);
          };
        });
      }
    });

    this.dropzone.on('complete', this.onUploadComplete);
  }
});

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
    "upload", "status", "previewElement", "previewTemplate", "accepted" 
  ];

  $.each(origProps, function(i, p) {
    newFile[p] = origFile[p];
  });

  return newFile;
}


Vue.component('filedrop', FileDrop);

export default FileDrop;