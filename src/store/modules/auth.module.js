import { firebase } from "@nativescript/firebase";

const state = {
  authIsLoading: true,
  user: null,
  authError: null,
  isLogged: false,
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
  async authInit({ commit, dispatch }) {
    commit("authStart");

    return firebase
      .getCurrentUser()
      .then(async (currentUser) => {
        if (currentUser !== null) {
          await dispatch("fetchUserData", currentUser.uid);
        } else {
          commit("authError", null);
        }
      })
      .catch((err) => {
        commit("authError", err);
      });
  },

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
    console.log("signUp");

    return firebase
      .createUser({
        email: email,
        password: password,
      })
      .then(async (userData) => {
        console.log("succeeded");

        await dispatch("createUserDoc", {
          uid: userData.uid,
          email: email,
          userName: userName,
        });
      })
      .catch((err) => {
        commit("authError", err);
        console.log(err);
      });
  },

  async createUserDoc({ dispatch }, { uid, email, userName }) {
    console.log("createUserDoc");

    const usersRef = firebase.firestore.collection("users").doc(uid);

    usersRef
      .set({
        email: email,
        userName: userName,
      })
      .then(async () => {
        console.log("succeeded");
        await dispatch("fetchUserData", uid);
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  },

  async fetchUserData({ commit }, { uid }) {
    console.log("fetchUserData");
    const userRef = firebase.firestore.collection("users").doc(uid);

    return userRef
      .get()
      .then((docSnapshot) => {
        console.log("succeeded");
        commit("authSuccess", docSnapshot.data());
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
        commit("authError", err);
      });
  },

  signOut({ commit }) {
    firebase
      .logout()
      .then(() => {
        commit("setSideDrawer", false);
        return Promise;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
