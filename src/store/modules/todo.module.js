import { firebase } from "@nativescript/firebase";

const state = {
  todoGroupList: [],
  todoGroupListIsLoading: true,
};

const getters = {
  todoGroupList: (state) => {
    return state.todoGroupList;
  },

  todoGroupListIsLoading: (state) => {
    return state.todoGroupListIsLoading;
  },
};

const mutations = {
  fetchTodoGroupListStart(state) {
    state.todoGroupListIsLoading = true;
  },

  fetchTodoGroupListSuccess(state, todoGroupList) {
    state.todoGroupList = todoGroupList;
    state.todoGroupListIsLoading = false;
  },

  fetchTodoGroupListError(state) {
    state.todoGroupListIsLoading = false;
  },
};

const actions = {
  addTodo({ dispatch }, { projectID, todoGroupID, todo }) {
    const todoGroupRef = firebase.firestore
      .collection("projects/" + projectID + "/todo")
      .doc(todoGroupID);

    todoGroupRef
      .update({
        todos: firebase.firestore.FieldValue.arrayUnion(todo),
      })
      .then(() => {
        dispatch("fetchTodoGroupList", projectID);
      });
  },

  addTodoGroup({ dispatch }, { projectID, categoryName }) {
    console.log("addTodoGroup");

    const projectTodoRef = firebase.firestore.collection(
      "projects/" + projectID + "/todo"
    );

    return projectTodoRef
      .add({
        name: categoryName,
        todos: [],
      })
      .then(async () => {
        await dispatch("fetchTodoGroupList", projectID);
      });
  },

  fetchTodoGroupList({ commit, rootGetters }, projectID) {
    //TODO on shapshot change
    console.log("fetchTodoGroupList");

    commit("fetchTodoGroupListStart");

    const projectTodoRef = firebase.firestore.collection(
      "projects/" + projectID + "/todo"
    );

    projectTodoRef
      .get()
      .then((collectionSnapshot) => {
        let todoGroupList = [];

        collectionSnapshot.forEach((todoGroupDoc) => {
          todoGroupList.push({ ...todoGroupDoc.data(), id: todoGroupDoc.id });
        });

        todoGroupList.forEach((todoGroup) => {
          todoGroup.todos.forEach((todo) => {
            todo.users.forEach((todoUser, index, array) => {
              array[index] = rootGetters.users.find(
                (user) => user.uid === todoUser
              );
            });
          });
        });

        commit("fetchTodoGroupListSuccess", todoGroupList);
      })
      .catch((err) => {
        console.log(err);
        commit("fetchTodoGroupListError");
      });
  },
};

export default {
  actions,
  state,
  getters,
  mutations,
};
