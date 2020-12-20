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

};

const actions = {

};

export default {
    actions,
    state,
    getters,
    mutations,
};