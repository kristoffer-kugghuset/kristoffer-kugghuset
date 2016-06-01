'use strict'

import Promise from 'bluebird';

import config from '../config';
import utils from './utils';
import auth from './auth.service';

// Get shorthands to utils.storage and utils.http
const {storage, http} = utils;

let __currentLeaderboards;

function __setCurrentLocalLeaderboards(leaderboards) {
	// Set __currentLeaderboards
	__currentLeaderboards = leaderboards;
	// Store in local storage
	storage.set('currentLeaderboards', __currentLeaderboards);
	// Return leaderboards
	return __currentLeaderboards;
}


function __getCurrentLocalLeaderboards() {
	if (!__currentLeaderboards) {
		__currentLeaderboards = storage.get('currentLeaderboards');
	}

	return __currentLeaderboards;
}

function __getCurrentRemoteLeaderboards() {
	return new Promise((resolve, reject) => {
		let _headers = auth.getHeaders();

    http.get(`${config.baseUrl}/services/salesforce/leaderboards`, {headers: _headers})
    .then((leaderboards) => {
      __setCurrentLocalLeaderboards(leaderboards);
      resolve(leaderboards);
    })
    .catch(reject);
	})
}

export function getCurrent() {
  if (!!__getCurrentLocalLeaderboards()) {
    return __getCurrentLocalLeaderboards();
  } else {
    return __getCurrentRemoteLeaderboards();
  }
}

export default {
  getCurrent: getCurrent,
  getRemote: __getCurrentRemoteLeaderboards,
  getLocal: __getCurrentLocalLeaderboards,
}