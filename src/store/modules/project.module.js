import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";

const state = {
  projectList: [],
  users: [],
  projectIsLoading: true,
  project: {},
  foundUsers: [],
  searchUsersIsLoading: false,
  projectListIsLoading: true,
};

const getters = {
  projectIsLoading: (state) => {
    return state.projectIsLoading;
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

  bindProjectListSuccess(state) {
    state.projectListIsLoading = false;
  },

  bindProjectListStart(state) {
    state.projectListIsLoading = true;
  },

  fetchUsersSuccess(state, users) {
    state.users = users;
  },

  resetProject(state) {
    state.users = [];
    state.project = {};
    state.changes = [];
    state.todoGroupList = [];
    state.topChangeDoc = null;
    state.bottomChangeDoc = null;
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
  setUserRole({ rootGetters, dispatch }, { uid, oldRole, newRole, username }) {
    const projectID = rootGetters.project.id;
    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    return projectRef
      .update({
        roles: firebase.firestore.FieldValue.arrayRemove({
          uid: uid,
          role: oldRole,
        }),
      })
      .then(async () => {
        await projectRef.update({
          roles: firebase.firestore.FieldValue.arrayUnion({
            uid: uid,
            role: newRole,
          }),
        });
      })
      .then(() => {
        dispatch(
          "addHistory",
          "Zaktualizowano rolę użytkownika " +
            username +
            ". Nowa rola to: " +
            newRole
        );
      });
  },

  async deleteProject({ dispatch }, projectID) {
    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    await dispatch("unbindProject");

    return projectRef.delete();
  },

  addUsersToProject({ rootGetters, dispatch }, users) {
    console.log(users);

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

    let roles = [];

    users.forEach((uid) => {
      roles.push({
        uid: uid,
        role: "",
      });
    });

    return projectRef
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(users),
        roles: firebase.firestore.FieldValue.arrayUnion(roles),
      })
      .then(() => {
        dispatch("addHistory", "Dodano nowego użytkownika/ów");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  searchUser({ commit, rootGetters }, searchString) {
    commit("searchUsersStart");

    const usersRef = firebase.firestore.collection("users");
    const uid = rootGetters.getUser.uid;
    const projectUsers = rootGetters.users;

    usersRef
      .where("email", "==", searchString.toLocaleLowerCase())
      .get()
      .then((usersSnapshot) => {
        const users = [];

        usersSnapshot.forEach((userDoc) => {
          if (
            userDoc.id === uid ||
            projectUsers.some((user) => user.uid === userDoc.id)
          ) {
            return;
          }

          const data = userDoc.data();

          if (!data.imageSrc) {
            data.imageSrc = rootGetters.userImgPlaceholder;
          }

          users.push({ ...data, uid: userDoc.id });
        });

        commit("searchUsersSuccess", users);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  removeUserFromProject({ rootGetters, dispatch }, { uid, username }) {
    const projectID = rootGetters.project.id;
    const roles = rootGetters.project.roles;
    const currentUid = rootGetters.getUser.uid;
    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    if (currentUid === uid) return;

    const role = roles.find((role) => role.uid === uid);

    return projectRef
      .update({
        users: firebase.firestore.FieldValue.arrayRemove(uid),
        roles: firebase.firestore.FieldValue.arrayRemove(role),
      })
      .then(() => {
        dispatch("addHistory", "Usunięto użytkownika: " + username);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  async addProject({ rootGetters }, { project, image = null }) {
    console.log("addProject");

    const projectsRef = firebase.firestore.collection("projects");
    const uid = rootGetters.getUser.uid;
    const metadata = {};

    project.status = 0;
    project.users = [uid];
    project.roles = [{ uid: uid, role: "role" }];
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
      })
      .catch((err) => {
        console.log(err);
      });
  },

  async fetchProjectUsers({ commit, rootGetters }, { projectUsers, roles }) {
    const usersRef = firebase.firestore.collection("users");

    const users = [];

    for (let i = 0; i < projectUsers.length; i++) {
      const uid = projectUsers[i];

      await usersRef
        .doc(uid)
        .get()
        .then((userDoc) => {
          let data = userDoc.data();

          const role = roles.find((role) => role.uid === uid);

          if (!data.imageSrc) {
            data.imageSrc = rootGetters.userImgPlaceholder;
          }

          users.push({
            ...data,
            uid: uid,
            role: role.role ? role.role : "",
          });
        });
    }

    commit("fetchUsersSuccess", users);
  },

  unbindProject: firestoreAction(({ unbindFirestoreRef }) => {
    return unbindFirestoreRef("project", false);
  }),

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
        const roles = data.roles;

        if (!data.imageSrc) {
          data.imageSrc = rootGetters.projectImgPlaceholder;
        }

        function arrayEquals(a, b) {
          return (
            Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index])
          );
        }

        if (
          (users && !arrayEquals(users, data.users)) ||
          arrayEquals(roles, data.roles)
        ) {
          //On init users is empty thus the user fetch should not occur
          //On next updates fetch users if user array is different than current
          dispatch("fetchProjectUsers", {
            projectUsers: data.users,
            roles: data.roles,
          });
        }

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      return bindFirestoreRef("project", projectRef, {
        serialize,
        reset: false,
      })
        .then(async (project) => {
          await dispatch("fetchProjectUsers", {
            projectUsers: project.users,
            roles: project.roles,
          });

          async function parallel() {
            const initChat = dispatch("initChat", projectID);
            const bindTodo = dispatch("bindTodoGroupList", projectID);
            const bindChanges = dispatch("initChanges", projectID);

            await initChat;
            await bindTodo;
            await bindChanges;
          }

          await parallel();

          console.log("qwerqwer");
          commit("fetchProjectSuccess");
        })
        .catch((err) => {
          commit("fetchProjectError");
          console.log(err);
        });
    }
  ),

  editProject({ rootGetters, dispatch }, { project, projectID, image = null }) {
    console.log("editProject");

    const uid = rootGetters.getUser.uid;

    const projectRef = firebase.firestore.collection("projects").doc(projectID);

    projectRef
      .update(project)
      .then(() => {
        dispatch("addHistory", "Zaktualizowano dane projektu");
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

  bindProjectList: firestoreAction(
    ({ bindFirestoreRef, rootGetters, commit }) => {
      commit("bindProjectListStart");

      const uid = rootGetters.getUser.uid;
      const projectRef = firebase.firestore
        .collection("projects")
        .where("users", "array-contains", uid)
        .orderBy("priority", "desc")
        .orderBy("status", "asc")
        .orderBy("createdAt", "asc");

      const serialize = (doc) => {
        let data = doc.data();

        if (!data.imageSrc) {
          data.imageSrc = rootGetters.projectImgPlaceholder;
        }

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      return bindFirestoreRef("projectList", projectRef, {
        serialize,
      })
        .then(() => {
          commit("bindProjectListSuccess");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  ),
};

export default {
  actions,
  state,
  getters,
  mutations,
};
