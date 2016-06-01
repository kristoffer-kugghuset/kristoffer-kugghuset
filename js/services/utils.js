'use strict'

import Vue from 'vue';
import {assign, forEach, attempt, isError} from 'lodash';
import Promise from 'bluebird';

// Use vue-resource
Vue.use(require('vue-resource'));

/**
 * Tries to parse value and return it.
 *
 * If value can't be parsed or the parse is empty, value itself is returned.
 *
 * @param {Any} value Value to try to parse
 * @return {Any} Whatever was either parsed or *value* itself
 */
export const jsonParseOrValue = (value) => {
  try {
    return JSON.parse(value) || value;
  } catch (error) {
    return value;
  }
}

/**
 * Headers should be attached to options.headers
 *
 * @param {String} method The HTTP method to make. Case-insensitive. Defaults to 'GET'.
 * @param {String} url Absolute or relative
 * @param {Object} data Data to pass as the body. Not required.
 * @param {Object} options An options object containing whatever else axajx(...) may use.
 * @param {Boolean} dataOnly Shuold only the data object be returned?
 * @return {Promise} -> {Any}
 */
function _request(method = 'GET', url, data, options = {}, dataOnly) {
  return new Promise((resolve, reject) => {
    const _url = /\?/.test(url)
      ? `${url}&cachebust=${Date.now()}`
      : `${url}?cachebust=${Date.now()}`;

    Vue.http(assign({}, options, {
      method: method,
      data: data,
      url: _url,
      headers: options.headers,
    }))
    .then(
      (resp) => resolve(!!dataOnly ? resp.data : resp),
      (err) => {
        console.log(err);
        if(err.status == 401) {
          localStorage.clear();
          location.reload();
        }
        reject(new Error(`${err.status}: ${err.statusText}`));
      }
    );
  });
}

/**
 * Complete container object for http methods.
 */
export const http = {
  /**
   * Makes a GET request to *url* and returns a promise of it.
   *
   * @param {String} url Url to make request to
   * @param {Object} options Options object, should probably contain headers
   * @param {Boolean} dataOnly Should only the data object be returned? Defaults to true.
   * @return {Promise} -> {Any}
   */
  get: (url, options, dataOnly = true) => _request('GET', url, null, options, dataOnly),
  /**
   * Makes a POST request to *url* with a body of *data*
   * and returns a promise of it.
   *
   * @param {String} url Url to make request to
   * @param {Object} data JSON serializable data
   * @param {Object} options Options object, should probably contain headers
   * @param {Boolean} dataOnly Should only the data object be returned? Defaults to true.
   * @return {Promise} -> {Any}
   */
  post: (url, data, options, dataOnly = true) => _request('POST', url, data, options, dataOnly),
  /**
   * Makes a PUT request to *url* with a body of *data*
   * and returns a promise of it.
   *
   * @param {String} url Url to make request to
   * @param {Object} data JSON serializable data
   * @param {Object} options Options object, should probably contain headers
   * @param {Boolean} dataOnly Should only the data object be returned? Defaults to true.
   * @return {Promise} -> {Any}
   */
  put: (url, data, options, dataOnly = true) => _request('PUT', url, data, options, dataOnly),
  /**
   * Makes a DELETE request to *url* and returns a promise of it.
   *
   * @param {String} url Url to make request to
   * @param {Object} options Options object, should probably contain headers
   * @param {Boolean} dataOnly Should only the data object be returned? Defaults to true.
   * @return {Promise} -> {Any}
   */
  delete: (url, options, dataOnly = true) => _request('DELETE', url, null, options, dataOnly),
};

export const storage = {
  set: (key, value) => {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }

    return value;
  },
  get: (key) => {
    let _data = localStorage.getItem(key);
    let _parsed = attempt(() => JSON.parse(_data));

    return isError(_parsed)
      ? _data
      : _parsed;
  },
  clear: () => {
    localStorage.clear();
  }
}

export default {
  jsonParseOrValue: jsonParseOrValue,
  http: http,
  storage: storage,
}