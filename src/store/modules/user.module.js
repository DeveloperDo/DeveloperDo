import { firebase } from "@nativescript/firebase";

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

const mutations = {
  fetchUserSuccess(state) {
    state.userIsLoading = false;
  },

  fetchUserStart(state) {
    state.userIsLoading = true;
  },

  fetchUserError(state) {
    state.userIsLoading = false;
  },
};

const actions = {
  updateUserName({ rootGetters }, { userName }) {
    console.log("updateUserName");

    const userID = rootGetters.getUser.uid;
    const userRef = firebase.firestore.collection("users").doc(userID);

    return userRef.update(userName).catch((err) => {
      console.log(err);
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
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
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
