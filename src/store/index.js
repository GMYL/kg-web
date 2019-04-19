import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import tag from './modules/tag';
import article from './modules/article';
import auth from './modules/auth';
import enums from './modules/enums';
import control from './modules/control';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    user,
    tag,
    article,
    auth,
    enums,
    control
  }
});

export default store;
