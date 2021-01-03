import { firebase } from "@nativescript/firebase";
import { translateErrors } from "../../mixins/translateErrors";

const state = {
  user: {},
  userIsLoading: true,
  updateEmailError: null,
  updateEmailPasswordError: null,
  updatePasswordError: null,
  deleteUserError: null,
};

const getters = {
  user: (state) => {
    return state.user;
  },

  userIsLoading: (state) => {
    return state.userIsLoading;
  },

  updateEmailError: (state) => {
    return state.updateEmailError;
  },

  updateEmailPasswordError: (state) => {
    return state.updateEmailPasswordError;
  },

  updatePasswordError: (state) => {
    return state.updatePasswordError;
  },

  deleteUserError: (state) => {
    return state.deleteUserError;
  },
};

const mutations = {
  resetUserUpdateErrors(state) {
    state.updateEmailError = null;
    state.updateEmailPasswordError = null;
    state.updatePasswordError = null;
  },

  setUpdateEmailError(state, err) {
    state.updateEmailError = translateErrors(err);
  },

  setUpdateEmailPasswordError(state, err) {
    state.updateEmailPasswordError = translateErrors(err);
  },

  setUpdatePasswordError(state, err) {
    state.updatePasswordError = translateErrors(err);
  },

  setDeleteUserError(state, err) {
    state.deleteUserError = translateErrors(err);
  },
};

const actions = {
  changeUserAvatar({ dispatch, rootGetters }, image) {
    const userID = rootGetters.getUser.uid;
    const userRef = firebase.firestore.collection("users").doc(userID);

    if (image) {
      const metadata = {};

      firebase.storage
        .uploadFile({
          remoteFullPath: "users/" + userID,
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
              remoteFullPath: "users/" + userID,
            })
            .then((url) => {
              userRef
                .update({
                  imageSrc: url,
                })
                .then(() => {
                  dispatch("fetchUserData", { uid: userID });
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

  updateUserName({ dispatch, rootGetters }, { userName }) {
    console.log("updateUserName");

    const userID = rootGetters.getUser.uid;
    const userRef = firebase.firestore.collection("users").doc(userID);

    return userRef
      .update(userName)
      .then(async () => {
        dispatch("fetchUserData", { uid: userID }).then(() => {
          alert({
            title: "Udało się!",
            message: "Aktualizacja nazwy się powiodła!",
            okButtonText: "Ok",
          });
        });
      })
      .catch((err) => {
        alert(translateErrors(err));
      });
  },

  updateUserEmail(
    { rootGetters, commit, dispatch },
    { userEmailNew, userEmailOld, userPassword }
  ) {
    console.log("updateUserEmail");

    const userID = rootGetters.getUser.uid;
    const userRef = firebase.firestore.collection("users").doc(userID);

    return firebase
      .reauthenticate({
        type: firebase.LoginType.PASSWORD,

        passwordOptions: {
          email: userEmailOld,
          password: userPassword,
        },
      })
      .then(async () => {
        await firebase
          .updateEmail(userEmailNew)
          .then(async () => {
            await userRef
              .update({ email: userEmailNew.toLocaleLowerCase() })
              .then(async () => {
                await dispatch("fetchUserData", { uid: userID }).then(() => {
                  alert({
                    title: "Udało się!",
                    message: "Aktualizacja adresu email się powiodła!",
                    okButtonText: "Ok",
                  });
                });
              })
              .catch((err) => {
                console.log(err);
                alert(translateErrors(err));
              });
          })
          .catch((err) => {
            console.log(err);
            commit("setUpdateEmailError", err);
          });
      })
      .catch((err) => {
        console.log(err);
        commit("setUpdateEmailPasswordError", err);
      });
  },

  updateUserPassword(
    { commit, dispatch, rootGetters },
    { userPasswordNew, userPasswordOld, userEmail }
  ) {
    console.log("updateUserPassword");
    const userID = rootGetters.getUser.uid;

    return firebase
      .reauthenticate({
        type: firebase.LoginType.PASSWORD,

        passwordOptions: {
          email: userEmail,
          password: userPasswordOld,
        },
      })
      .then(async () => {
        await firebase
          .updatePassword(userPasswordNew)
          .then(async () => {
            await dispatch("fetchUserData", { uid: userID }).then(() => {
              alert({
                title: "Udało się!",
                message: "Aktualizacja hasła się powiodła!",
                okButtonText: "Ok",
              });
            });
          })
          .catch((err) => {
            console.log(err);
            alert(translateErrors(err));
          });
      })
      .catch((err) => {
        console.log(err);
        commit("setUpdatePasswordError", err);
      });
  },

  deleteUser({ rootGetters, dispatch, commit }, { email, password }) {
    console.log("deleteUser");

    const userID = rootGetters.getUser.uid;
    const userRef = firebase.firestore.collection("users").doc(userID);

    return firebase
      .reauthenticate({
        type: firebase.LoginType.PASSWORD,

        passwordOptions: {
          email: email,
          password: password,
        },
      })
      .then(async () => {
        await userRef
          .delete()
          .then(async () => {
            await firebase.deleteUser();
          })
          .then(async () => {
            await dispatch("signOut");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        commit("setDeleteUserError", err);
      });
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
