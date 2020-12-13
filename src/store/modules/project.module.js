import { firebase } from "@nativescript/firebase";

const state = {
  projectList: [],
  projectListLoading: false,
  project: {},
};

const getters = {
  getProjectListLoading: (state) => {
    return state.projectListLoading;
  },

  getProjectList: (state) => {
    return state.projectList;
  },

  getProject: (state) => {
    return state.project;
  },
};

const mutations = {
  fetchProjectListSuccess(state, projectList) {
    state.projectList = state.projectList.concat(projectList);
    state.projectListLoading = false;
  },

  fetchProjectListStart(state) {
    state.projectListLoading = true;
  },

  fetchProjectListError(state) {
    state.projectListLoading = false;
  },
};

const actions = {
  fetchProjectList({ commit, rootGetters }) {
    commit("fetchProjectListStart");
    const uid = rootGetters.getUser.uid;

    const projectRef = firebase.firestore
      .collection("projects")
      .where("users", "array-contains", uid);

    projectRef
      .get()
      .then((collectionSnapshot) => {
        let projectList = [];
        collectionSnapshot.forEach((projectDoc) => {
          projectList.push(projectDoc.data());
        });
        commit("fetchProjectListSuccess", projectList);
      })
      .catch((err) => {
        commit("fetchProjectListError");
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
