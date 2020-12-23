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

        userRef
            .update(userName)
            .catch(err => {console.log(err)})
    },

    updateUserEmail({ dispatch, rootGetters }, { userEmailNew, userEmailOld, userPassword }) {
        console.log("updateUserEmail");

        const userID = rootGetters.getUser.uid;
        const userRef = firebase.firestore.collection("users").doc(userID);

        firebase.reauthenticate({
            type: firebase.LoginType.PASSWORD,

            passwordOptions: {
                email: userEmailOld,
                password: userPassword
            }
        }).then(
            function (result) {
                userRef
                    .update({email: userEmailNew})
                    .catch(err => {console.log(err)})

                firebase.updateEmail(userEmailNew)
                    .then(() => {
                            dispatch("fetchUserData",{uid: userID});
                        }
                    )
                    .catch(err => {console.log(err)})
            },
            function (error) {
                console.log(error)
            }
        );
    }

};

export default {
    actions,
    state,
    getters,
    mutations,
};