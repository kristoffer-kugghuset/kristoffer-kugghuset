'use strict'

import Vue from 'vue';

import template from './lead-item.template.html';

const LeadItem = Vue.extend({
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
    id: {
      type: String,
      default: null
    },
    status: {
      type: String,
      default: null
    },
    onDeleted: {
      type: Function
    }
  },
  computed: {
    icon: function () {
      if(this.status == "New") {
        return "assets/img/lead-open.svg"
      } else if(this.status == "Qualified") {
        return "assets/img/lead-win.svg"
      } else if(this.status == "Unqualified") {
        return "assets/img/lead-fail.svg"
      } else {
        return "assets/img/lead-open.svg"
      }
    }
  },
  methods: {
    deleteLead: function() {
      var r = confirm("Do you really want to delete this lead?");
      if(r == true) {
        //console.log("Lead deleted")
        if (typeof this.onDeleted === 'function') {
          this.onDeleted(this.id);
        }
      }
    }
  }
});

Vue.component('lead-item', LeadItem);

export default LeadItem;
