'use strict'

import Vue from 'vue';
import {omit} from 'lodash';

import template from './registerdetails.template.html';

import utils from '../../../services/utils';
import leads from '../../../services/lead.service';

import VueMdl from 'vue-mdl';
Vue.use(VueMdl);

const RegisterDetails = Vue.extend({
  template,
  props: {
    title: {
      type: String,
    },
  },
  data: function() {
    return {
        leadDetails: {
          orgName: '',
          contactPerson: '',
          street: '',
          mobilePhone: '',
          email: '',
          provider: '',
          terminal: '',
          contractExpiration: '',
          product: '',
          comments: '',
          id: '',
        },
        photoView: true,
        isLoading: false,
    }
  },
  computed: {
    missingRequiredFields: function () {
      if (
          this.leadDetails.orgName == '' ||
          this.leadDetails.mobilePhone == '' ||
          this.leadDetails.contactPerson == ''
      ) {return true}
      else {
        return false
      };
    },

    emailInvalid: function () {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.leadDetails.email) {
        return !re.test(this.leadDetails.email);
      } else {
        return false;
      }
    },

    readyToSubmit: function () {
      if (missingRequiredFields || emailInvalid) {
        return false
      } else {
        return true
      };
    }

  },
  methods: {
    submitLead: function() {
      if (this.isLoading) {
        // No more clicking for now
        return;
      }

      if (this.missingRequiredFields) {
        this.missingRequiredFields = true;
        return;
      }

      this.isLoading = true;

      // Get the lead item only
      let _lead = omit(
        this.$data.leadDetails, 
        [
          //'provider',
          //'terminal',
          //'contractExpiration',
          //'product',
        ]
      );

      // Create or update the lead
      leads.createOrUpdate(_lead)
      .then((lead) => {
        leads.add(lead);
        this.$broadcast('lead_submit_response', lead);
      })
      .catch((err) => {
        this.isLoading = false;
        console.log(err);
      });
    },

    exitView: function() {
      this.$router.go(window.history.back());
    }
  },
  events: {
    'uploaded': function(data) {
      this.isLoading = false;
      this.$router.go('/');
    }
  },
});

Vue.component('registerdetails', RegisterDetails);

export default RegisterDetails;
