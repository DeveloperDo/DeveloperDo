import { firebase } from "@nativescript/firebase";

const state = {
  projectList: [],
  projectListLoading: false,
  users: {},
  chat: [],
  chatIsLoading: true,
  detailsIsLoading: true,
  changes: [],
};

const getters = {
  detailsIsLoading: (state) => {
    return state.detailsIsLoading;
  },

  changes: (state) => {
    return state.changes;
  },

  projectListIsLoading: (state) => {
    return state.projectListLoading;
  },

  projectList: (state) => {
    return state.projectList;
  },

  users: (state) => {
    return state.users;
  },

  chat: (state) => {
    return state.chat;
  },

  chatIsLoading: (state) => {
    return state.chatIsLoading;
  },
};

const mutations = {
  fetchDetailsSuccess(state, { users, changes }) {
    state.changes = changes;
    state.users = users;
    state.detailsIsLoading = false;
  },

  fetchDetailsStart(state) {
    state.detailsIsLoading = true;
  },

  fetchDetailsError(state) {
    state.detailsIsLoading = false;
  },

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

  // fetchChanges({ commit }, projectID) {
  //   commit("fetchChangesStart");
  //
  //   const changesRef = firebase.firestore
  //     .collection("projects/" + projectID + "/changes")
  //     .orderBy("timestamp", "desc");
  //
  //   changesRef
  //     .get()
  //     .then((changesSnapshot) => {
  //       const changes = [];
  //
  //       changesSnapshot.forEach((change) => {
  //         changes.push(change.data());
  //       });
  //
  //       commit("fetchChangesSuccess", changes);
  //     })
  //     .catch((err) => {
  //       commit("fetchChangesError");
  //       console.log(err);
  //     });
  // },

  fetchDetails({ commit }, { projectID, projectUsers }) {
    commit("fetchDetailsStart");

    const changesRef = firebase.firestore
      .collection("projects/" + projectID + "/changes")
      .orderBy("timestamp", "desc");
    const userRef = firebase.firestore.collection("users");
    const users = [];
    const changes = [];

    setTimeout(() => {
      changesRef
        .get()
        .then(async (changesSnapshot) => {
          changesSnapshot.forEach((change) => {
            changes.push(change.data());
          });

          for (const uid of projectUsers) {
            await userRef
              .doc(uid)
              .get()
              .then((userDoc) => {
                console.log("fetched user");
                users.push({
                  ...userDoc.data(),
                  uid: uid,
                });
              });
          }
          console.log("after fetch users");

          commit("fetchDetailsSuccess", { users, changes });
        })
        .catch((err) => {
          commit("fetchDetailsError");
          console.log(err);
        });
    }, 5000);
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
