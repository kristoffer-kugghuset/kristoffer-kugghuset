'use strict'

import Vue from 'vue';

import template from './top-navigation.template.html';

const BamboraInput = Vue.extend({
  template,
  props: {
    placholder: {
      type: String,
      default: 'Type something',
    },
    body: {
      type: String,
    },
  },
});

Vue.component('top-navigation', BamboraInput);

export default BamboraInput;
