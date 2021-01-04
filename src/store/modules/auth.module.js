import { firebase } from "@nativescript/firebase";
import { translateErrors } from "../../mixins/translateErrors";

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
  getAuthError: (state) => {
    return state.authError;
  },
};

const mutations = {
  signOut(state) {
    state.projectList = [];
    state.user = false;
    state.isLogged = false;
  },
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
    state.authError = null;
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
    console.log("authInit");

    commit("authStart");

    return firebase
      .getCurrentUser()
      .then(async (currentUser) => {
        console.log("authInit succeded");
        console.log("user is logged: " + !!currentUser);
        if (currentUser !== null) {
          await dispatch("fetchUserData", { uid: currentUser.uid });
        } else {
          commit("authError", null);
        }
      })
      .catch((err) => {
        commit("authError", err);
      });
  },

  signIn({ commit, dispatch }, { email, password }) {
    console.log("signIn");

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
        console.log("signIn succeeded");
        await dispatch("fetchUserData", { uid: user.uid });
      })
      .catch((err) => {
        console.log("signIn error");
        console.log(err);
        commit("authError", translateErrors(err));
      });
  },

  signUp({ commit, dispatch }, { name, password, email }) {
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
          name: name,
        });
      })
      .catch((err) => {
        console.log(err);
        commit("authError", translateErrors(err));
      });
  },

  createUserDoc({ dispatch }, { uid, email, name }) {
    console.log("createUserDoc");

    const usersRef = firebase.firestore.collection("users").doc(uid);

    return usersRef
      .set({
        email: email,
        name: name,
        imageSrc: null,
      })
      .then(async () => {
        console.log("succeeded");
        await dispatch("fetchUserData", { uid: uid });
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  },

  async fetchUserData({ commit, rootGetters }, { uid }) {
    console.log("fetchUserData");
    const userRef = firebase.firestore.collection("users").doc(uid);

    return userRef
      .get()
      .then((docSnapshot) => {
        let data = docSnapshot.data();

        data.imageSrc = data.imageSrc
          ? data.imageSrc
          : rootGetters.userImgPlaceholder;

        const user = {
          ...data,
          uid: uid,
        };
        commit("authSuccess", user);
      })
      .catch((err) => {
        console.log(err);
        commit("authError", err);
      });
  },

  signOut({ commit }) {
    return firebase
      .logout()
      .then(() => {
        commit("signOut");
        commit("setSideDrawer", false);
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
