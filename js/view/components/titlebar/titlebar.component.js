'use strict'

import Vue from 'vue';

const Titlebar = Vue.extend({
  template,
  props: {
    title: {
      type: String,
    },
  },
});

import template from './titlebar.template.html';

Vue.component('titlebar', Titlebar);

export default Titlebar;
