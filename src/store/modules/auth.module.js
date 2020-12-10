import { firebase } from "@nativescript/firebase";
import sideDrawer from "../../mixins/sideDrawer";
import ProjectList from "../../pages/ProjectList";
import Login from "../../pages/Login";

const state = {
  authIsLoading: true,
  user: {},
  authError: null,
  isLogged: null,
};

const getters = {
  authIsLoading: (state) => {
    return state.authIsLoading;
  },
  isLogged: (state) => {
    return state.isLogged;
  },
};

const mutations = {
  authSuccess(state, user) {
    state.user = user;
    state.authIsLoading = false;
    state.isLogged = true;
  },
  authStart(state) {
    state.authIsLoading = true;
  },
  authError(state, err) {
    state.authIsLoading = false;
    state.isLogged = false;
    state.authError = err;
  },
  resetAuthError(state) {
    state.authIsLoading = false;
    state.error = null;
  },
  authSignOut(state) {
    state.isLogged = false;
    state.error = null;
    state.user = null;
    state.authIsLoading = false;
  },
};

const actions = {
  signIn({ commit, dispatch }, { email, password }) {
    commit("authStart");

    firebase
      .login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: email,
          password: password,
        },
      })
      .then(async (user) => {
        console.log(user);
        await dispatch("fetchUserData", user.uid);
      })
      .catch((err) => {
        console.log(err);
        commit("authError", err);
      });
  },

  fetchUserData({ commit }, { uid }) {
    console.log(uid);
    commit("authSuccess", uid);

    return Promise;
  },

  signOut({ commit }) {
    firebase
      .logout()
      .then(() => {
        console.log("logout");
        commit("setSideDrawer", false);
        return Promise;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("signOut");
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
