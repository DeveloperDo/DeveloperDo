import {firebase} from '@nativescript/firebase';

const state = {
    authIsLoading: false,
    user: {},
    authError: null
};

const getters = {
    authIsLoading: state => {
        return state.authIsLoading;
    },
};

const mutations = {
    authSuccess(state, user) {
        state.user = user;
        state.authIsLoading = false;
    },
    authStart(state) {
        state.authIsLoading = true;
    },
    authError(state, error) {
        state.authIsLoading = false;
        state.authError = error;
    },
    resetAuthError(state) {
        state.authIsLoading = false;
        state.error = null;
    }
};

const actions = {
    signIn({ commit, dispatch }, { email, password }) {
        commit("authStart");

        firebase.login(
            {
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: email,
                    password: password
                }
            })
            .then(result => {
            })
            .catch(error => console.log(error));
    },

    fetchUserData({commit}, {uid}) {
        console.log(uid);
    },

    signOut() {
        console.log("signOut")
    }
};

export default {
    actions,
    state,
    getters,
    mutations
};
