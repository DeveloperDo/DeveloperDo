import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";
import { set } from "@nativescript/core/ui/core/bindable/bindable-resources";

const state = {
  projectList: [],
  users: [],
  projectIsLoading: true,
  changes: [],
  project: {},
  foundUsers: [],
  searchUsersIsLoading: false,
  projectListIsLoading: true,
};

const getters = {
  projectIsLoading: (state) => {
    return state.projectIsLoading;
  },

  changes: (state) => {
    return state.changes;
  },

  projectListIsLoading: (state) => {
    return state.projectListIsLoading;
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

  foundUsers: (state) => {
    return state.foundUsers;
  },

  searchUsersIsLoading: (state) => {
    return state.searchUsersIsLoading;
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
    state.projectListIsLoading = false;
  },

  fetchProjectListStart(state) {
    state.projectListIsLoading = true;
  },

  fetchProjectListError(state) {
    state.projectListIsLoading = false;
  },

  fetchUsersSuccess(state, users) {
    state.users = users;
  },

  resetProject(state) {
    state.users = [];
    state.project = {};
    state.changes = [];
    state.todoGroupList = [];
  },

  searchUsersSuccess(state, users) {
    state.foundUsers = users;
    state.searchUsersIsLoading = false;
  },

  searchUsersStart(state) {
    state.searchUsersIsLoading = true;
  },

  resetSearchUsers(state) {
    state.foundUsers = [];
  },
};

const actions = {
  addUsersToProject({ rootGetters }, users) {
    let projectID;

    if (rootGetters.project) {
      projectID = rootGetters.project.id;
    } else {
      return;
    }
    if (!projectID) {
      return;
    }

    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    return projectRef
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(users),
      })
      .catch((err) => {
        console.log(err);
      });
  },

  searchUser({ commit, rootGetters }, searchString) {
    commit("searchUsersStart");

    const usersRef = firebase.firestore.collection("users");
    const uid = rootGetters.getUser.uid;

    usersRef
      .where("email", "==", searchString.toLocaleLowerCase())
      .get()
      .then((usersSnapshot) => {
        const users = [];

        usersSnapshot.forEach((userDoc) => {
          if (userDoc.id === uid) return;

          users.push({ ...userDoc.data(), uid: userDoc.id });
        });

        commit("searchUsersSuccess", users);
      })
      .catch((err) => {
        console.log(err);
      });
  },

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

  async addProject({ dispatch, rootGetters }, { project, image = null }) {
    console.log("addProject");

    const projectsRef = firebase.firestore.collection("projects");
    const uid = rootGetters.getUser.uid;
    const metadata = {};

    project.deadline = null;
    project.status = 0;
    project.users = [uid];
    project.changes = [];
    project.imageSrc = null;

    projectsRef
      .add(project)
      .then(async (res) => {
        const projectID = res.id;
        const changesRef = firebase.firestore.collection(
          "projects/" + res.id + "/changes"
        );

        async function parallel() {
          const setChanges = changesRef
            .add({
              name: "Utworzono projekt",
            })
            .then(async (change) => {
              await changesRef.doc(change.id).update({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
          const setProjectCreatedAt = projectsRef.doc(res.id).update({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          const setImage = image
            ? firebase.storage
                .uploadFile({
                  remoteFullPath: "projects/" + projectID,
                  localFullPath: image.android.toString(),
                  onProgress: function (status) {
                    console.log(
                      "Uploaded fraction: " + status.fractionCompleted
                    );
                    console.log(
                      "Percentage complete: " + status.percentageCompleted
                    );
                  },
                  metadata,
                })
                .then(async () => {
                  await firebase.storage
                    .getDownloadUrl({
                      remoteFullPath: "projects/" + projectID,
                    })
                    .then(async (url) => {
                      await projectsRef
                        .doc(projectID)
                        .update({
                          imageSrc: url,
                        })
                        .then(() => {
                          console.log("url updated");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                })
            : null;

          await setChanges;
          await setProjectCreatedAt;
          await setImage;
        }

        await parallel();

        await dispatch("fetchProjectList");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  bindChanges: firestoreAction(
    ({ bindFirestoreRef, rootGetters, commit }, projectID) => {
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
        console.log(users);
        console.log(data.users);
        if (users !== [] && !arrayEquals(users, data.users)) {
          console.log("------");
          dispatch("fetchProjectUsers", data.users);
        }

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      await bindFirestoreRef("project", projectRef, {
        serialize,
        reset: false,
      })
        .then(async (project) => {
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
        })
        .catch((err) => {
          commit("fetchProjectError");
          console.log(err);
        });
    }
  ),

  editProject({ rootGetters }, { project, projectID, image = null }) {
    console.log("editProject");

    const uid = rootGetters.getUser.uid;

    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    projectRef
      .update(project)
      .then(() => {
        console.log("project updated");
      })
      .catch((err) => {
        console.log(err);
      });

    const metadata = {};

    if (image) {
      firebase.storage
        .uploadFile({
          remoteFullPath: "projects/" + projectID,
          localFullPath: image.android.toString(),
          onProgress: function (status) {
            console.log("Uploaded fraction: " + status.fractionCompleted);
            console.log("Percentage complete: " + status.percentageCompleted);
          },
          metadata,
        })
        .then(() => {
          firebase.storage
            .getDownloadUrl({
              remoteFullPath: "projects/" + projectID,
            })
            .then((url) => {
              projectRef
                .update({
                  imageSrc: url,
                })
                .then(() => {
                  console.log("url updated");
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },

  fetchProjectList({ commit, rootGetters }) {
    console.log("fetchProjectList");
    commit("fetchProjectListStart");
    const uid = rootGetters.getUser.uid;

    const projectRef = firebase.firestore
      .collection("projects")
      .where("users", "array-contains", uid)
      .orderBy("priority", "desc")
      .orderBy("status", "asc")
      .orderBy("createdAt", "asc");

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
