import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import auth from "./modules/auth.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth
  },
});