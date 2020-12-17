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
    console.log("fasdfasdfasdfasdfasdf");
    const todoGroupRef = firebase.firestore
      .collection("projects/" + projectID + "/todo")
      .doc(todoGroupID);

    console.log("fasdfasdfasdfasdfasdf");

    return todoGroupRef
      .update({
        todos: firebase.firestore.FieldValue.arrayUnion(todo),
      })
      .then(async () => {
        await dispatch("fetchTodoGroupList", projectID);
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

    const projectTodoRef = firebase.firestore.collection(
      "projects/" + projectID + "/todo"
    );

    return projectTodoRef
      .get()
      .then((collectionSnapshot) => {
        let todoGroupList = [];

        collectionSnapshot.forEach((todoGroupDoc) => {
          todoGroupList.push({ ...todoGroupDoc.data(), id: todoGroupDoc.id });
        });

        for (let i = 0; i < 100000; i++) {
          console.log(i);
        }

        todoGroupList.forEach((todoGroup) => {
          todoGroup.todos.forEach((todo) => {
            todo.users.forEach((todoUser, index, array) => {
              array[index] = rootGetters.users.find(
                (user) => user.uid === todoUser
              );
            });
          });
        });

        console.log(todoGroupList);

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
