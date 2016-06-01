'use strict'

import {assign} from 'lodash';

/**
 * Returns a promise of the path to the newly taken photo.
 *
 * @param {Object} options Camera options, optional
 * @return {Promise} -> {String}
 */
export const getPicture = (options) => new Promise((resolve, reject) => {
  let _options = assign({}, {
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
  }, options);

  // Try get the picture
  navigator.camera.getPicture((imageUri) => {
    resolve(imageUri);
  }, (errorMsg) => {
    // Something went wrong when taking the picture
    reject(new Error(errorMsg));
  }, _options);
});

export default {
  getPicture: getPicture,
}
