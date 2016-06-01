'use strict'

import Vue from 'vue';

import template from './placeholder-item.template.html';

const PlaceholderItem = Vue.extend({
  template,
  props: {
    text: {
      type: String,
      default: 'Nothing to see here...'
    },
  },
  computed: {
    icon: function () {
      return "assets/img/gray.avatar.svg"
    }
  }
});

Vue.component('placeholder-item', PlaceholderItem);

export default PlaceholderItem;
