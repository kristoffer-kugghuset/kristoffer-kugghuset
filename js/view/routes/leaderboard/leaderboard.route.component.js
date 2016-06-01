'use strict'

import Vue from 'vue';

import template from './leaderboard.route.template.html';
import Promise from 'bluebird';

import dummyData from '../../../../assets/dummydata/dummyData';

import leaderboards from '../../../services/leaderboards.service';
import auth from '../../../services/auth.service';

// Use Vue truncate
Vue.use(require('vue-truncate'));

const LeaderboardRouteComponet = Vue.extend({
  template,
  data: function () {
    if(!!leaderboards.getLocal()){
      return {
        leaderboards: leaderboards.getLocal(),
        leaderBoardGlobal: leaderboards.getLocal().userLeaderboard,
        leaderBoardMyTeam: leaderboards.getLocal().currentTeamLeaderboard,
        leaderBoardTeams: leaderboards.getLocal().teamLeaderboard,
        showGlobal: true,
        showTeams: false,
        showMyTeam: false,
      }
    } else {
      return {
        leaderBoardGlobal: {},
        leaderBoardMyTeam: {},
        leaderBoardTeams: {},
        showGlobal: true,
        showTeams: false,
        showMyTeam: false
      }
    }
  },

  route: {
    data: function () {
      // Resolve data from remote
      return new Promise(function (resolve, reject) {
        leaderboards.getRemote()
        .then((_leaderboards) => resolve({ 
          leaderBoardGlobal: _leaderboards.userLeaderboard,
          leaderBoardMyTeam: _leaderboards.currentTeamLeaderboard,
          leaderBoardTeams: _leaderboards.teamLeaderboard,
        }))
        .catch(function (err) {
          console.log(err);
          resolve(this.$data);
        }.bind(this))
      }.bind(this));
    }
  },

  computed: {
    filteredLeaderBoardTeams: function() {
      function notNull(team){
        return !!team.teamName;
      };
      return this.leaderBoardTeams.filter(notNull);
    },
  },

  methods: {
  	toggleShowGlobal: function() {
  		this.$data.showGlobal = true;
  		this.$data.showTeams = false;
  		this.$data.showMyTeam = false;
  	},
    toggleShowTeams: function() {
  		this.$data.showGlobal = false;
  		this.$data.showTeams = true;
  		this.$data.showMyTeam = false;
    },
    toggleShowMyTeam: function() {
  		this.$data.showGlobal = false;
  		this.$data.showTeams = false;
  		this.$data.showMyTeam = true;
    }
  }
});

export default LeaderboardRouteComponet;
