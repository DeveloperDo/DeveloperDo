import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";

Vue.use(Vuex);

import auth from "./modules/auth.module";
import sideDrawer from "./modules/sideDrawer.module";
import project from "./modules/project.module";
import todo from "./modules/todo.module";
import chat from "./modules/chat.module";
import placeholders from "./modules/placeholders.module";
import user from "./modules/user.module";

export default new Vuex.Store({
  modules: {
    auth,
    sideDrawer,
    project,
    todo,
    chat,
    placeholders,
    user,
  },
  mutations: {
    ...vuexfireMutations,
  },
});
