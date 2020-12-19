import { firebase } from "@nativescript/firebase";

const state = {
  projectList: [],
  users: {},
  projectIsLoading: true,
  changes: [],
};

const getters = {
  projectIsLoading: (state) => {
    return state.projectIsLoading;
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
};

const mutations = {
  fetchProjectSuccess(state) {
    state.projectIsLoading = false;
  },

  fetchProjectDetailsSuccess(state, { users, changes }) {
    state.changes = changes;
    state.users = users;
  },

  fetchProjectStart(state) {
    state.projectIsLoading = true;
  },

  fetchProjectError(state) {
    state.detailsIsLoading = false;
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

  async fetchProject({ commit, dispatch }, { projectID, projectUsers }) {
    console.log("fetch project");
    commit("fetchProjectStart");

    const changesRef = firebase.firestore
      .collection("projects/" + projectID + "/changes")
      .orderBy("timestamp", "desc");
    const userRef = firebase.firestore.collection("users");
    const users = [];
    const changes = [];

    await changesRef
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
              users.push({
                ...userDoc.data(),
                uid: uid,
              });
            });
        }

        async function parallel() {
          const fetchChat = dispatch("bindChat", projectID);
          const fetchTodo = dispatch("bindTodoGroupList", projectID);
          await fetchChat;
          await fetchTodo;
        }

        commit("fetchProjectDetailsSuccess", { users, changes });

        await parallel();

        commit("fetchProjectSuccess");
      })
      .catch((err) => {
        commit("fetchProjectError");
        console.log(err);
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
};

export default {
  actions,
  state,
  getters,
  mutations,
};
