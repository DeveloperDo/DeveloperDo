import { firebase } from "@nativescript/firebase";

const state = {
  authIsLoading: true,
  user: {},
  authError: null,
  isLogged: null,
};

const getters = {
  getUser: (state) => {
    return state.user;
  },
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

    return firebase
      .login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: email,
          password: password,
        },
      })
      .then(async (user) => {
        await dispatch("fetchUserData", user.uid);
      })
      .catch((err) => {
        console.log(err);
        commit("authError", err);
      });
  },

  signUp({ commit, dispatch }, { userName, password, email }) {
    commit("authStart");

    return firebase
      .createUser({
        email: email,
        password: password,
      })
      .then((userData) => {
        console.log(userData);

        dispatch("createUserDoc", {
          uid: userData.uid,
          email: email,
          userName: userName,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  async createUserDoc({ dispatch }, { uid, email, userName }) {
    const usersRef = firebase.firestore.collection("users").doc(uid);

    usersRef
      .set({
        email: email,
        userName: userName,
      })
      .then(async () => {
        await dispatch("fetchUserData", uid);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  async fetchUserData({ commit }, { uid }) {
    console.log("fetchUserData");
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
