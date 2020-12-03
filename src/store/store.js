import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from "@nativescript/firebase";

Vue.use(Vuex);

import auth from "./modules/auth.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth
  },
});