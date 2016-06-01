'use strict'

import Vue from 'vue';

import template from './user-item.template.html';

const UserItem = Vue.extend({
  template,
  props: {
    firstName: {
      type: String,
      default: 'No Name'
    },
    lastName: {
      type: String,
      default: 'No Name'
    },
    team: {
      type: String,
      default: null
    },
    points: {
      type: Number,
      default: null
    },
  },
  computed: {
    initials: function () {
      return this.firstName.charAt(0) + this.lastName.charAt(0)
    },
    title: function () {
      return this.firstName + " " + this.lastName;
    }
  }
});

Vue.component('user-item', UserItem);

export default UserItem;
