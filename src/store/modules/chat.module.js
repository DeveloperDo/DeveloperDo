import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";

const state = {
  chat: [],
};

const getters = {
  chat: (state) => {
    return state.chat;
  },
};

const mutations = {};

const actions = {
  bindChat: firestoreAction(({ bindFirestoreRef, commit }, projectID) => {
    const projectChatRef = firebase.firestore
      .collection("projects/" + projectID + "/chat")
      .orderBy("timestamp", "asc")
      .limit(15);

    const serialize = (doc) => {
      const data = doc.data();

      Object.defineProperty(data, "id", { value: doc.id });
      Object.defineProperty(data, "_doc", { value: doc });
      return data;
    };

    bindFirestoreRef("chat", projectChatRef, {
      serialize,
    })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }),
};

export default {
  actions,
  state,
  getters,
  mutations,
};
