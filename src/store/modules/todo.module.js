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
  addTodoGroup({ dispatch }, { projectID, categoryName }) {
    console.log("addTodoGroup");

    const projectTodoRef = firebase.firestore.collection(
      "projects/" + projectID + "/todo"
    );

    return projectTodoRef
      .add({
        name: categoryName,
        todos: [],
      })
      .then(async () => {
        await dispatch("fetchTodoGroupList", projectID);
      });
  },

  fetchTodoGroupList({ commit }, projectID) {
    //TODO on shapshot change
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
