import { firebase } from "@nativescript/firebase";

function translateErrors(errCode) {
  switch (errCode) {
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

    default: {
      return "Błąd aktualizacji danych!";
    }
  }
}

const state = {
  user: {},
  userIsLoading: true,
};

const getters = {
  user: (state) => {
    return state.user;
  },

  userIsLoading: (state) => {
    return state.userIsLoading;
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
    { rootGetters },
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
              .catch((err) => {
                console.log(err);
                alert(translateErrors(err));
              });
          })
          .catch((err) => {
            console.log(err);
            alert(translateErrors(err));
          });
      })
      .catch((err) => {
        console.log(err);
        alert(translateErrors(err));
      });
  },

  updateUserPassword ({ rootGetters, commit }, { userPasswordNew, userPasswordOld, userEmail }) {
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
          await firebase
              .updatePassword(userPasswordNew)
              .catch((err) => {
                console.log(err);
                alert(translateErrors(err));
              })
        })
        .catch((err) => {
          console.log(err);
          alert(translateErrors(err));
        })
  }
};

export default {
  actions,
  state,
  getters,
};
