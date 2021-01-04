import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";

const state = {
  chat: [],
  chatIsLoading: true,
};

const getters = {
  chatIsLoading: (state) => {
    return state.chatIsLoading;
  },
  chat: (state) => {
    return state.chat;
  },
};

const mutations = {
  chatLoaded(state) {
    state.chatIsLoading = false;
  },
};

const actions = {
  bindChat: firestoreAction(
    ({ bindFirestoreRef, rootGetters, commit }, projectID) => {
      const projectChatRef = firebase.firestore
        .collection("projects/" + projectID + "/chat")
        .orderBy("timestamp", "asc");

      const serialize = (doc) => {
        let data = doc.data();

        console.log(data);

        const user = rootGetters.users.find((user) => user.uid === data.uid);

        data.user = user
          ? user
          : { name: "", imageSrc: rootGetters.userImgPlaceholder };

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      bindFirestoreRef("chat", projectChatRef, {
        serialize,
      })
        .then(() => {
          commit("chatLoaded");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  ),

  sendMessage({}, { message, projectID }) {
    console.log("sendMessage");

    const chatRef = firebase.firestore
      .collection("projects")
      .doc(projectID)
      .collection("chat");

    return chatRef
      .add(message)
      .then(async (msg) => {
        await chatRef.doc(msg.id).update({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
