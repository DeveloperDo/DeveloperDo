import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from "@nativescript/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    msg: ""
  },
  getters: {
    getMsg: state => {
      return state.msg;
    }
  },
  mutations: {
    setMsg(state, msg) {
      state.msg = msg;
    }
  },
  actions: {
    fetchMsg({commit}) {
      console.log("start +++++++++++");
      firebase.firestore.collection("test").doc("test").get().then(msgDoc => {
        console.log(msgDoc.data().test);
        commit("setMsg", msgDoc.data().test);
      })
    }
  }
});
