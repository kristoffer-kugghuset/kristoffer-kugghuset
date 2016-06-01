'use strict'

import Promise from 'bluebird';

import config from '../config';
import utils from './utils';
import auth from './auth.service';

// Get shorthands to utils.storage and utils.http
const {storage, http} = utils;

/**
 * All cached leads
 *
 * @type {Array}
 */
let __currentLeads;

/**
 * Caches *leads*.
 *
 * @param {Array} leads Leads to update/store
 * @return {Array}
 */
function __setCurrentLocalLeads(leads) {
  // Set __currentLeads
  __currentLeads = leads;
  // Store them to local storage
  storage.set('currentLeads', __currentLeads);
  // Return them
  return __currentLeads;
}

/**
 * Returns the cached leads
 *
 * @return {Array}
 */
function __getCurrentLocalLeads() {
  // If __currentLeads isn't defined, (try) get them from local storage
  if (!__currentLeads) {
    __currentLeads = storage.get('currentLeads');
  }

  return __currentLeads;
}

/**
 * Returns a promise of the current leads
 * from the server.
 *
 * Will update current local
 *
 * @return {Promise} -> {Array}
 */
function __getCurrentRemoteLeads() {
  return new Promise((resolve, reject) => {
    let _headers = auth.getHeaders();

    http.get(`${config.baseUrl}/services/salesforce/leads`, {headers: _headers})
    .then((leads) => {
      __setCurrentLocalLeads(leads);
      resolve(leads);
    })
    .catch(reject);
  });
}

/****************
 * Exports below
 ****************/

/**
 * Creates or updates a Lead on the server.
 *
 * @param {Object} lead Lead object to create or update
 * @return {Promise} -> {Object}
 */
export function createOrUpdate(lead) {
  let _headers = auth.getHeaders();

  return http.post(`${config.baseUrl}/services/salesforce/leads`, lead, { headers: _headers })
}

/**
 * @param {String} method The method of which to get my leads
 */
export function getCurrent(method = 'local') {
  if (method === 'any') {
    if (!!__getCurrentLocalLeads()) {
      method = 'local';
    }
  }

  // If the local method should be used, get the cached one
  if (method === 'local') {
    return Promise.resolve(__getCurrentLocalLeads());
  }

  return __getCurrentRemoteLeads();
}

/**
 * @param {Object} lead Lead object to push to the leads array
 * @return {Object}
 */
export function add(lead) {
  let _leads = __getCurrentLocalLeads();
  _leads.push(lead);

  __setCurrentLocalLeads(_leads);
  return __getCurrentLocalLeads();
}

/**
 * Deletes a lead from the server.
 *
 * @param {String} id Id of the lead to delete
 * @return {Promise} -> {String}
 */
export function remove(id) {
  return new Promise((resolve, reject) => {

    let _headers = auth.getHeaders();

    http.delete(`${config.baseUrl}/services/salesforce/leads/${id}`, { headers: _headers })
    .then(() => {
      let _leads = __getCurrentLocalLeads().filter((lead) => lead.id != id);
      __setCurrentLocalLeads(_leads);

      resolve(id);
    })
    .catch(reject);
  });
}

export default {
  getCurrent: getCurrent,
  getLocal: __getCurrentLocalLeads,
  createOrUpdate: createOrUpdate,
  add: add,
  remove: remove,
}
