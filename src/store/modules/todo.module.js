import { firebase } from "@nativescript/firebase";

const state = {
  todoGroupList: [],
  todoGroupListIsLoading: true,
};

const getters = {
  todoGroupList: (state) => {
    return state.todoGroupList;
  },

  todoGroupListIsLoading: (state) => {
    return state.todoGroupListIsLoading;
  },
};

const mutations = {
  fetchTodoGroupListStart(state) {
    state.todoGroupListIsLoading = true;
  },

  fetchTodoGroupListSuccess(state, todoGroupList) {
    state.todoGroupList = todoGroupList;
    state.todoGroupListIsLoading = false;
  },

  fetchTodoGroupListError(state) {
    state.todoGroupListIsLoading = false;
  },
};

const actions = {
  fetchTodoGroupList({ commit }, { projectID }) {
    console.log("fetchTodoGroupList");

    commit("fetchTodoGroupListStart");

    const projectTodoRef = firebase.firestore.collection(
      "projects/" + projectID + "/todo"
    );

    projectTodoRef
      .get()
      .then((collectionSnapshot) => {
        let todoGroupList = [];

        collectionSnapshot.forEach((todoGroupDoc) => {
          todoGroupList.push(todoGroupDoc.data());
        });

        console.log(todoGroupList);
        commit("fetchTodoGroupListSuccess", todoGroupList);
      })
      .catch((err) => {
        console.log(err);
        commit("fetchTodoGroupListError");
      });
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
