import { firebase } from "@nativescript/firebase";
import { time } from "@nativescript/core/profiling";

const state = {
  projectList: [],
  projectListLoading: false,
  project: {},
  chat: [],
  chatIsLoading: true,
  todoGroupList: [],
  todoGroupListIsLoading: true,
};

const getters = {
  projectListIsLoading: (state) => {
    return state.projectListLoading;
  },

  projectList: (state) => {
    return state.projectList;
  },

  project: (state) => {
    return state.project;
  },

  chat: (state) => {
    return state.chat;
  },

  chatIsLoading: (state) => {
    return state.chatIsLoading;
  },

  todoGroupList: (state) => {
    return state.todoGroupList;
  },

  todoGroupListIsLoading: (state) => {
    return state.todoGroupListIsLoading;
  },
};

const mutations = {
  fetchChatStart(state) {
    state.chatIsLoading = true;
  },

  fetchChatSuccess(state, chat) {
    state.chat = chat;
    state.chatIsLoading = false;
  },

  fetchChatError(state) {
    state.chatIsLoading = false;
  },

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

  fetchProjectListSuccess(state, projectList) {
    state.projectList = projectList;
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
  fetchChat({ commit }, { projectID }) {
    console.log("fetchChat");
    commit("fetchChatStart");

    const projectChatRef = firebase.firestore.collection(
      "projects/" + projectID + "/chat"
    );

    projectChatRef
      .get()
      .then((collectionSnapshot) => {
        let chat = [];

        collectionSnapshot.forEach((msgDoc) => {
          chat.push(msgDoc.data());
        });

        console.log(chat);
        commit("fetchChatSuccess", chat);
      })
      .catch((err) => {
        console.log(err);
        commit("fetchChatError");
      });
  },

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
          projectList.push({ ...projectDoc.data(), id: projectDoc.id });
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
