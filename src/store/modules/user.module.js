import { firebase } from "@nativescript/firebase";

function translateErrors(errCode) {
  switch (errCode.toString()) {
    case "Updating email failed. com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The email address is badly formatted.": {
      return "Niepoprawny format nowego adresu e-mail!";
    }
    case "Updating email failed. com.google.firebase.auth.FirebaseAuthUserCollisionException: The email address is already in use by another account.": {
      return "Podany adres e-mail jest już zajęty!";
    }
    case "Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument": {
      return "Zmiana adresu e-mail lub hasła wymaga podania aktualnego hasła!";
    }
    case "com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The password is invalid or the user does not have a password.": {
      return "Podano niepoprawne aktualne hasło!";
    }
    case "com.google.firebase.FirebaseTooManyRequestsException: We have blocked all requests from this device due to unusual activity. Try again later. [ Access to this account has been temporarily disabled due to many failed login attempts." +
      " You can immediately restore it by resetting your password or you can try again later. ]": {
      return "Zbyt dużo nieudanych prób logowania! Spróbuj później!";
    }

    default: {
      return "Błąd aktualizacji danych!";
    }
  }
}

const state = {
  user: {},
  userIsLoading: true,
  changeEmailError: null,
  currentPasswordError: null,
};

const getters = {
  user: (state) => {
    return state.user;
  },

  userIsLoading: (state) => {
    return state.userIsLoading;
  },

  currentPasswordError: (state) => {
    return state.currentPasswordError;
  },

  changeEmailError: (state) => {
    return state.changeEmailError;
  },
};

const mutations = {
  resetUserUpdateErrors(state) {
    state.currentPasswordError = "";
    state.changeEmailError = "";
  },

  setPasswordError(state, err) {
    console.log(err);
    state.currentPasswordError = translateErrors(err);
  },

  setEmailError(state, err) {
    console.log(err);
    state.changeEmailError = translateErrors(err);
  },
};

const actions = {
  updateUserName({ rootGetters }, { userName }) {
    console.log("updateUserName");

    const userID = rootGetters.getUser.uid;
    const userRef = firebase.firestore.collection("users").doc(userID);

    return userRef.update(userName).catch((err) => {
      console.log(err);
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
                await dispatch("fetchUserData", { uid: userID });
              })
              .catch((err) => {
                console.log(err);
                alert(translateErrors(err));
              });
          })
          .catch((err) => {
            console.log(err);
            commit("setEmailError", err);
          });
      })
      .catch((err) => {
        console.log(err);
        commit("setPasswordError", err);
      });
  },

  updateUserPassword(
    { commit },
    { userPasswordNew, userPasswordOld, userEmail }
  ) {
    console.log("updateUserPassword");

    return firebase
      .reauthenticate({
        type: firebase.LoginType.PASSWORD,

        passwordOptions: {
          email: userEmail,
          password: userPasswordOld,
        },
      })
      .then(async () => {
        await firebase.updatePassword(userPasswordNew).catch((err) => {
          console.log(err);
          alert(translateErrors(err));
        });
      })
      .catch((err) => {
        console.log(err);
        commit("setPasswordError", err);
      });
  },

  deleteUser({ rootGetters, dispatch }, { email, password }) {
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
          await userRef.delete()
              .then(async () => {
                await firebase.deleteUser()
              })
                  .then(async () => {
                    await dispatch("signOut")
                  })
              .catch((err) => {
                console.log(err);
              });
        })
        .catch((err) => {
          console.log(err);
          commit("setPasswordError", err);
        });
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
