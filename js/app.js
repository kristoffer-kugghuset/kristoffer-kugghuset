'use strict'

// Import styles
import 'material-design-lite';
import 'normalize.css/normalize.css'; 
import '../style/main.scss';

import auth from './services/auth.service';

// Make jQuery as $ available globally
window.jQuery = window.$ = require('jquery');

import view from './view/view';

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	document.documentElement.requestFullscreen();
	StatusBar.hide();
}