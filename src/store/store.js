import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import auth from "./modules/auth.module";
import sideDrawer from "./modules/sideDrawer.module";
import project from "./modules/project.module";
import todo from "./modules/todo.module";

export default new Vuex.Store({
  modules: {
    auth,
    sideDrawer,
    project,
    todo,
  },
});
