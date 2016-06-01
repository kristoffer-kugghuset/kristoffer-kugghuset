'use strict'

import Vue from 'vue';

import template from './myleads.route.template.html';
import Promise from 'bluebird';

import dummyData from '../../../../assets/dummydata/dummyData';

import leads from '../../../services/lead.service';
import auth from '../../../services/auth.service';

// Use Vue truncate
Vue.use(require('vue-truncate'));

const MyLeadsRouteComponet = Vue.extend({
  template,
  data: function () {
    return {
      myLeads: leads.getLocal(),
      currentUserName: auth.getName(),
      currentUserTeam: (auth.getCurrentUser() || {}).team,
    };
  },

  computed: {
    currentUserScore: function () {
      console.log()
      var score = 0;
      if(this.myLeads) {
        for(var i = 0; i < this.myLeads.length; i++) {
          if(this.myLeads[i].status === "Qualified") {
            score = score + 3;
          } else {
            score = score + 1;
          }
        };
      };
      return score;
    },
  },

  route: {
    data: function () {
      // Resolve data from remote
      return new Promise(function (resolve, reject) {
        leads.getCurrent('remote')
        .then((_leads) => resolve({ myLeads: _leads }))
        .catch(function (err) {
          console.log(err);
          resolve(this.$data);
        }.bind(this))
      }.bind(this));
    }
  },

  methods: {
    onDeleted: function(id) {
      console.log("Deleting " + id);

      leads.remove(id)
      .then((_id) => {
        this.$data.myLeads = leads.getLocal();
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
});

export default MyLeadsRouteComponet;