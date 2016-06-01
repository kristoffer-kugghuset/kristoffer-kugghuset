'use strict'

import Vue from 'vue';

import template from './itembar.template.html';

const ItemBar = Vue.extend({
  template,
  props: {
    title: {
      type: String,
      default: 'No Name'
    },
    subtitle: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: 'default'
    },
    points: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      default: null
    }
  },
});

Vue.component('itembar', ItemBar);

export default ItemBar;
