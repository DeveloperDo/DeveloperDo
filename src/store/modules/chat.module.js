import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";

const state = {
  chat: [],
  archivedChatIsLoading: true,
  firstVisible: null,
  topMessageDoc: null,
  bottomMessageDoc: null,
  chatNewMessages: [],
};

const getters = {
  firstVisible: (state) => {
    return state.firstVisible;
  },

  topMessageDoc: (state) => {
    return state.topMessageDoc;
  },

  bottomMessageDoc: (state) => {
    return state.bottomMessageDoc;
  },

  archivedChatIsLoading: (state) => {
    return state.archivedChatIsLoading;
  },

  chat: (state) => {
    const currentChat = state.chat.concat(...state.chatNewMessages);

    return currentChat;
  },
};

const mutations = {
  resetChat(state) {
    state.chat = [];
    state.chatNewMessages = [];
    state.topMessageDoc = null;
    state.bottomMessageDoc = null;
  },

  fetchArchivedChatStart(state) {
    state.archivedChatIsLoading = true;
  },

  fetchArchivedChatSuccess(state, archivedChat) {
    state.archivedChatIsLoading = false;

    state.chat.unshift(...archivedChat);
  },

  setTopMessageDoc(state, doc) {
    state.topMessageDoc = doc;
  },

  setBottomMessageDoc(state, doc) {
    state.bottomMessageDoc = doc;
  },
};

const actions = {
  async initChat({ dispatch, commit, rootGetters }, projectID) {
    commit("resetChat");
    commit("fetchArchivedChatStart");

    const projectChatRef = firebase.firestore
      .collection("projects/" + projectID + "/chat")
      .orderBy("timestamp", "desc")
      .limit(15);

    return projectChatRef.get().then(async (messages) => {
      if (!messages.empty) {
        let archivedChat = [];

        const length = messages.docs.length;
        commit("setTopMessageDoc", messages.docs[0]);

        commit("setBottomMessageDoc", messages.docs[length - 1]);

        messages.forEach((msgDoc) => {
          let data = msgDoc.data();
          const user = rootGetters.users.find((user) => user.uid === data.uid);

          data.user = user
            ? user
            : { name: "", imageSrc: rootGetters.userImgPlaceholder };

          archivedChat.push(data);
        });

        commit("fetchArchivedChatSuccess", archivedChat.reverse());
      }
      commit("fetchArchivedChatSuccess", []);
      await dispatch("bindChat", projectID);
    });
  },

  fetchArchivedChat({ commit, rootGetters }, projectID) {
    if (!rootGetters.bottomMessageDoc) return;

    commit("fetchArchivedChatStart");
    const bottomMessageDoc = rootGetters.bottomMessageDoc;

    const projectChatRef = firebase.firestore
      .collection("projects/" + projectID + "/chat")
      .orderBy("timestamp", "desc")
      .startAfter(bottomMessageDoc)
      .limit(15);

    return projectChatRef.get().then(async (messages) => {
      console.log(messages.docs.length);
      console.log("adfsasdfasdfasdfasdfasdf");
      if (messages.empty) return;

      let archivedChat = [];

      const length = messages.docs.length;

      if (messages.docs.length === 15) {
        commit("setBottomMessageDoc", messages.docs[length - 1]);
      } else {
        console.log("++++++++++++++++++++++++++++ setBottomMessageDoc null");
        commit("setBottomMessageDoc", null);
      }

      messages.forEach((msgDoc) => {
        let data = msgDoc.data();
        const user = rootGetters.users.find((user) => user.uid === data.uid);

        data.user = user
          ? user
          : { name: "", imageSrc: rootGetters.userImgPlaceholder };

        archivedChat.push(data);
      });

      commit("fetchArchivedChatSuccess", archivedChat.reverse());
      console.log("archivedChat");
      console.log(archivedChat.reverse());
      console.log("/archivedChat");
    });
  },

  bindChat: firestoreAction(({ bindFirestoreRef, rootGetters }, projectID) => {
    const topMessageDoc = rootGetters.topMessageDoc;

    let projectChatRef;

    projectChatRef = firebase.firestore
      .collection("projects/" + projectID + "/chat")
      .orderBy("timestamp", "asc");

    if (topMessageDoc) {
      projectChatRef = projectChatRef.startAfter(topMessageDoc); //start after oldest archived message
    }

    const serialize = (doc) => {
      let data = doc.data();

      const user = rootGetters.users.find((user) => user.uid === data.uid);

      data.user = user
        ? user
        : { name: "", imageSrc: rootGetters.userImgPlaceholder };

      Object.defineProperty(data, "id", { value: doc.id });
      Object.defineProperty(data, "_doc", { value: doc });

      return data;
    };

    bindFirestoreRef("chatNewMessages", projectChatRef, {
      serialize,
    }).catch((err) => {
      console.log(err);
    });
  }),

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
