'use strict'

import Vue from 'vue';

import template from './bottom-navigation.template.html';

const BottomNavigation = Vue.extend({
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

Vue.component('bottom-navigation', BottomNavigation);

export default BottomNavigation;
