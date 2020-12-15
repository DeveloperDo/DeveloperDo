import { firebase } from "@nativescript/firebase";

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
  async addProject({ dispatch, rootGetters }, { project }) {
    console.log("addProject");

    const projectRef = firebase.firestore.collection("projects");
    const uid = rootGetters.getUser.uid;

    project.deadline = null;
    project.imageSrc = null;
    project.status = null;
    project.users = [uid];
    project.changes = [];

    projectRef
      .add(project)
      .then(async (res) => {
        //TODO parallel function
        const changesRef = firebase.firestore.collection(
          "projects/" + res.id + "/changes"
        );

        await changesRef
          .add({
            name: "Utworzono projekt",
          })
          .then(async (change) => {
            await changesRef.doc(change.id).update({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          });

        await projectRef.doc(res.id).update({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await dispatch("fetchProjectList");
      })
      .catch((err) => {
        console.log(err);
      });
  },

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
    console.log("fetchProjectList");
    commit("fetchProjectListStart");
    const uid = rootGetters.getUser.uid;

    const projectRef = firebase.firestore
      .collection("projects")
      .where("users", "array-contains", uid);

    projectRef
      .get()
      .then(async (collectionSnapshot) => {
        let projectList = [];
        const docs = collectionSnapshot.docs;

        for (let i = 0; i < docs.length; i++) {
          const changesRef = firebase.firestore
            .collection("projects/" + docs[i].id + "/changes")
            .orderBy("timestamp", "desc");

          let changes = [];

          await changesRef.get().then((changesSnapshot) => {
            changesSnapshot.forEach((change) => {
              changes.push(change.data());
            });
          });

          projectList.push({
            ...docs[i].data(),
            id: docs[i].id,
            changes: changes,
          });
        }

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
