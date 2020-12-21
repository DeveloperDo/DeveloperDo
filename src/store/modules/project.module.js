import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";

const state = {
  projectList: [],
  users: null,
  projectIsLoading: true,
  changes: [],
  project: {},
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

  project: (state) => {
    return state.project;
  },
};

const mutations = {
  fetchProjectSuccess(state) {
    state.projectIsLoading = false;
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

  fetchUsersSuccess(state, users) {
    state.users = users;
  },

  resetProject(state) {
    console.log("asdfasdfasdfasdf++++++++++++++++++++++++++++++++++++++");
    state.users = [];
    state.project = {};
    state.changes = [];
    state.todoGroupList = [];
  },
};

const actions = {
  removeUserFromProject({ rootGetters }, uid) {
    const projectID = rootGetters.project.id;
    const currentUid = rootGetters.getUser.uid;
    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    if (currentUid === uid) return;

    return projectRef
      .update({
        users: firebase.firestore.FieldValue.arrayRemove(uid),
      })
      .catch((err) => {
        console.log(err);
      });
  },

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

  bindChanges: firestoreAction(
    ({ bindFirestoreRef, rootGetters }, projectID) => {
      const changesRef = firebase.firestore
        .collection("projects/" + projectID + "/changes")
        .orderBy("timestamp", "desc");

      const serialize = (doc) => {
        let data = doc.data();

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      return bindFirestoreRef("changes", changesRef, {
        serialize,
      }).catch((err) => {
        console.log(err);
      });
    }
  ),

  async fetchProjectUsers({ commit }, projectUsers) {
    const usersRef = firebase.firestore.collection("users");

    const users = [];

    for (let i = 0; i < projectUsers.length; i++) {
      const uid = projectUsers[i];

      await usersRef
        .doc(uid)
        .get()
        .then((userDoc) => {
          users.push({
            ...userDoc.data(),
            uid: uid,
          });
        });
    }

    commit("fetchUsersSuccess", users);
  },

  bindProject: firestoreAction(
    async ({ bindFirestoreRef, commit, dispatch, rootGetters }, projectID) => {
      commit("fetchProjectStart");
      commit("resetProject");

      const projectRef = firebase.firestore
        .collection("projects")
        .doc(projectID);

      const serialize = (doc) => {
        const data = doc.data();

        const users = rootGetters.project.users;

        function arrayEquals(a, b) {
          return (
            Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index])
          );
        }

        //On init users is empty thus the user fetch should not occur
        //On next updates fetch users if user array is different than current
        if (users === null && arrayEquals(users, data.users)) {
          dispatch("fetchProjectUsers", data.users);
        }

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      await bindFirestoreRef("project", projectRef, {
        serialize,
        reset: false,
      }).then(async (project) => {
        await dispatch("fetchProjectUsers", project.users);

        async function parallel() {
          const bindChat = dispatch("bindChat", projectID);
          const bindTodo = dispatch("bindTodoGroupList", projectID);
          const bindChanges = dispatch("bindChanges", projectID);

          await bindChat;
          await bindTodo;
          await bindChanges;
        }

        await parallel();

        commit("fetchProjectSuccess");
      });
    }
  ),

  editProject({ dispatch, rootGetters }, { project, projectID, projectUsers }) {
    console.log("editProject");

    const uid = rootGetters.getUser.uid;

    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    projectRef
      .update(project)
      .then(() => {
        dispatch("fetchProject", { projectID, projectUsers });
        dispatch("fetchProjectList");
      })
      .catch((err) => {
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
