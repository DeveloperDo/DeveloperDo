import {firebase} from '@nativescript/firebase';
import sideDrawer from "../../mixins/sideDrawer";

const state = {
    authIsLoading: true,
    user: {},
    authError: null,
    isLogged: null
};

const getters = {
    authIsLoading: state => {
        return state.authIsLoading;
    },
    isLogged: state => {
        return state.isLogged;
    }
};

const mutations = {
    authSuccess(state, user) {
        state.user = user;
        state.authIsLoading = false;
        state.isLogged = true;
    },
    authStart(state) {
        state.authIsLoading = true;
    },
    authError(state, err) {
        state.authIsLoading = false;
        state.isLogged = false;
        state.authError = err;
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
                console.log(result);
                commit('authSuccess', result);
            })
            .catch(err => {
                console.log(err);
                commit("authError", err);
            });
    },

    fetchUserData({commit}, {uid}) {
        console.log(uid);
        commit('authSuccess', "result");
    },

    signOut({commit}) {
        firebase.logout().then(() => {
            console.log("logout");
            commit("setSideDrawer", false)

        }).catch(err => {
            console.log(err);
        })
        console.log("signOut")
    }
};

export default {
    actions,
    state,
    getters,
    mutations
};
