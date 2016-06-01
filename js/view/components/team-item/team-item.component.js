'use strict'

import Vue from 'vue';

import template from './team-item.template.html';

const TeamItem = Vue.extend({
  template,
  props: {
    teamName: {
      type: String,
      default: 'No Name'
    },
    points: {
      type: Number,
      default: null
    }
  },
  computed: {
    icon: function () {
      return "assets/img/blue-avatar.svg"
    }
  }
});

Vue.component('team-item', TeamItem);

export default TeamItem;
