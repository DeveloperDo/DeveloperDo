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

};

export default {
    actions,
    state,
    getters,
    mutations,
};