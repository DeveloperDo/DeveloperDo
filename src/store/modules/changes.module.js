import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";

const state = {
  changes: [],
  topChangeDoc: null,
  bottomChangeDoc: null,
  archivedChangesIsLoading: true,
  archivedChanges: [],
};

const getters = {
  topChangeDoc: (state) => {
    return state.topChangeDoc;
  },

  bottomChangeDoc: (state) => {
    return state.bottomChangeDoc;
  },

  archivedChangesIsLoading: (state) => {
    return state.archivedChangesIsLoading;
  },

  archivedChanges: (state) => {
    return state.archivedChanges;
  },

  changes: (state) => {
    return state.changes;
  },
};

const mutations = {
  fetchArchivedChangesStart(state) {
    state.archivedChangesIsLoading = true;
  },

  fetchArchivedChangesSuccess(state, archivedChanges) {
    state.archivedChangesIsLoading = false;

    state.archivedChanges = archivedChanges;
  },

  setTopChangeDoc(state, doc) {
    state.topChangeDoc = doc;
  },

  setBottomChangeDoc(state, doc) {
    state.bottomChangeDoc = doc;
  },
};

const actions = {
  addHistory({ rootGetters }, changeName) {
    const projectID = rootGetters.project.id;
    const user = rootGetters.getUser;

    const historyRef = firebase.firestore.collection(
      "projects/" + projectID + "/changes"
    );

    historyRef
      .add({
        name: "(" + user.name + ") " + changeName,
      })
      .then(async (change) => {
        await historyRef.doc(change.id).update({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
  },

  initChanges({ dispatch, commit }, projectID) {
    commit("fetchArchivedChangesStart");

    const changesRef = firebase.firestore
      .collection("projects/" + projectID + "/changes")
      .orderBy("timestamp", "desc")
      .limit(5);

    return changesRef.get().then(async (changes) => {
      if (!changes.empty) {
        let ArchivedChanges = [];

        changes.forEach((doc) => {
          ArchivedChanges.push(doc.data());
        });

        const length = changes.docs.length;

        commit("setTopChangeDoc", changes.docs[0]);

        commit("setBottomChangeDoc", changes.docs[length - 1]);

        console.log(ArchivedChanges);
        commit("fetchArchivedChangesSuccess", ArchivedChanges);
      } else {
        commit("fetchArchivedChangesSuccess", []);
      }

      await dispatch("bindChanges", projectID);
    });
  },

  bindChanges: firestoreAction(
    ({ bindFirestoreRef, rootGetters }, projectID) => {
      const topChangeDoc = rootGetters.topChangeDoc;

      let changesRef = firebase.firestore
        .collection("projects/" + projectID + "/changes")
        .orderBy("timestamp", "asc");

      if (topChangeDoc) {
        changesRef = changesRef.startAfter(topChangeDoc);
      }

      const serialize = (doc) => {
        let data = doc.data();

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      return bindFirestoreRef("changes", changesRef, {
        serialize,
      }).catch((err) => {
        console.log(err);
      });
    }
  ),

  fetchArchivedChanges({ commit, rootGetters }, projectID) {
    console.log("fetch changes");

    if (!rootGetters.bottomChangeDoc) return;
    console.log("after return");

    commit("fetchArchivedChangesStart");

    const bottomChangeDoc = rootGetters.bottomChangeDoc;

    const changesRef = firebase.firestore
      .collection("projects/" + projectID + "/changes")
      .orderBy("timestamp", "desc")
      .startAfter(bottomChangeDoc)
      .limit(5);

    return changesRef.get().then(async (changes) => {
      if (changes.empty) return;

      let archivedChanges = [];

      changes.forEach((changeDoc) => {
        archivedChanges.push(changeDoc.data());
      });

      const length = changes.docs.length;

      if (changes.docs.length === 5) {
        commit("setBottomChangeDoc", changes.docs[length - 1]);
      } else {
        commit("setBottomChangeDoc", null);
      }

      console.log(archivedChanges);
      commit("fetchArchivedChangesSuccess", archivedChanges);
    });
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
