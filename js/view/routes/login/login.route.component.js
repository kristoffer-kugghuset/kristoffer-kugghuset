'use strict'

/**
 * TODO:
 * - Notify the user when login failed
 * - Set spinner on button when loading
 */

import Vue from 'vue';

import template from './login.route.template.html';

import auth from '../../../services/auth.service';

const LoginRouteComponet = Vue.extend({
  template,
  data: function () {
    return {
      email: '',
      password: '',
      isLoading: false,
      unauthorized: false,
      privateMode: false,
    }
  },
  methods: {
    onSubmit: function () {
      // Don't trigger if not allowed, or it's still loading
      if (!this.allowSubmit() || this.isLoading) {
        return;
      }

      // Dissallow submit
      this.isLoading = true;

      auth.login(this.email, this.password)
      .then((user) => {
        this.isLoading = false;

        // Go to home if successful
        this.$router.go('/');
      })
      .catch((err) => {
        this.isLoading = false;
        this.unauthorized = true;
        console.log(err);
      })
    },

    allowSubmit: function () {
      try {
        localStorage.test = "test";
      }
      catch(err) {
        this.privateMode = true;
        console.log("localStorage not available");
      }
      console.log(!!localStorage.test)
      return [
        this.email,
        this.password,
        !this.privateMode,
      ].every(val => !!val);
    },
  }
});

export default LoginRouteComponet;
