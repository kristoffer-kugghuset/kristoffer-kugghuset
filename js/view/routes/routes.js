'use strict'

import Vue from 'vue';
import VueRouter from 'vue-router';

// Use VueRouter
Vue.use(VueRouter);

import auth from '../../services/auth.service';

// Import route components here
import loginRouteComponent from './login/login.route.component'
import leaderboardRouteComponent from './leaderboard/leaderboard.route.component'
import myleadsRouteComponent from './myleads/myleads.route.component'
import newleadRouteComponent from './newlead/newlead.route.component'

import leads from '../../services/lead.service';

/**
 * When using VueRouter, no Vue instance should be created,
 * rather a _regular_ component is used for the app.
 */
const App = Vue.extend({})

const router = new VueRouter({
  hashbang: false
});

/**
 * Routes are defined in here.
 *
 * The keys are
 */
router.map({
  '/': {
    name: 'myleads',
    component: myleadsRouteComponent,
  },
  '/login': {
    name: 'login',
    component: loginRouteComponent,
  },
  '/leaderboard': {
    name: 'leaderboard',
    component: leaderboardRouteComponent,
  },
  '/newlead': {
    name: 'newlead',
    component: newleadRouteComponent,
  },
});

// Ensure routes which require auth is only accessible when authenticated
router.beforeEach((transition) => {
  if (auth.isLoggedIn() && transition.to.name === 'login') {
    console.log('User is already logged in, transition to home route.');
    transition.redirect('home');
  } else if (!auth.isLoggedIn() && transition.to.name !== 'login') {
    console.log('User is not logged in, transition to login route.');
    transition.redirect('login');
  } else {
    transition.next();
  }
});

router.redirect({
  '*': '/'
})

router.start(App, '#app-mount')

export default router;
