import * as firebase from '@nativescript/firebase'

const state = {
    msg: ""
};

const getters = {
    getMsg: state => {
        return state.msg;
    }
};

const mutations = {
    setMsg(state, msg) {
        state.msg = msg;
    }
};

const actions = {
    fetchMsg({commit}) {
        console.log("start +++++++++++");
        firebase.firestore.collection("test").doc("test").get().then(msgDoc => {
            console.log(msgDoc.data().test);
            commit("setMsg", msgDoc.data().test);
        })
    }
};

export default {
    actions,
    state,
    getters,
    mutations
};
