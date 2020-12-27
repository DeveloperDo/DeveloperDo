import { firebase } from "@nativescript/firebase";

const state = {
  userImgPlaceholder: null,
  projectImgPlaceholder: null,
  placeholdersLoading: true,
};

const getters = {
  userImgPlaceholder: (state) => {
    return state.userImgPlaceholder;
  },

  projectImgPlaceholder: (state) => {
    return state.projectImgPlaceholder;
  },

  placeholdersLoading: (state) => {
    return state.placeholdersLoading;
  },
};

const mutations = {
  fetchPlaceholdersSuccess(state, urls) {
    state.projectImgPlaceholder = urls[0];
    state.userImgPlaceholder = urls[1];
    state.placeholdersLoading = false;
  },

  fetchPlaceholdersStart(state) {
    state.placeholdersLoading = true;
  },
};

const actions = {
  fetchPlaceholders({ commit }) {
    console.log("fetchPlaceholders");
    commit("fetchPlaceholdersStart");

    const getUserImgPlaceholder = firebase.storage.getDownloadUrl({
      remoteFullPath: "placeholders/user-placeholder.jpg",
    });

    const getProjectImgPlaceholder = firebase.storage.getDownloadUrl({
      remoteFullPath: "placeholders/project-placeholder.png",
    });

    const promises = [getProjectImgPlaceholder, getUserImgPlaceholder];

    return Promise.all(promises).then((urls) => {
      commit("fetchPlaceholdersSuccess", urls);
    });
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
