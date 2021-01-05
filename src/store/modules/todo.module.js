import { firebase } from "@nativescript/firebase";
import { firestoreAction } from "vuexfire";

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

const mutations = {};

const actions = {
  deleteTodo({ dispatch }, { projectID, todoGroupID, todo }) {
    const todoGroupRef = firebase.firestore
      .collection("projects/" + projectID + "/todo")
      .doc(todoGroupID);

    const users = [];

    todo.users.forEach((user) => {
      users.push(user.uid);
    });

    todoGroupRef
      .update({
        todos: firebase.firestore.FieldValue.arrayRemove({
          name: todo.name,
          users: users,
        }),
      })
        .then(() => {
          dispatch("addHistory", "Usunięto zadanie: " + todo.name)
        })
      .catch((err) => {
        console.log(err);
      });
  },

  deleteTodoGroup({ dispatch }, { projectID, todoGroupID, todoGroupName }) {
    const todoGroupRef = firebase.firestore
      .collection("projects/" + projectID + "/todo")
      .doc(todoGroupID);

    todoGroupRef
      .delete()
        .then(() => {
          dispatch("addHistory", "Usunięto kategorię zadań: " + todoGroupName)
        })
      .catch((err) => {
        console.log(err);
      });
  },

  addTodo({ dispatch }, { projectID, todoGroupID, todo }) {
    const todoGroupRef = firebase.firestore
      .collection("projects/" + projectID + "/todo")
      .doc(todoGroupID);

    todoGroupRef
      .update({
        todos: firebase.firestore.FieldValue.arrayUnion(todo),
      })
        .then(() => {
          dispatch("addHistory", "Dodano zadanie: " + todo.name)
        })
      .catch((err) => {
        console.log(err);
      });
  },

  addTodoGroup({ dispatch }, { projectID, categoryName }) {
    const projectTodoRef = firebase.firestore.collection(
      "projects/" + projectID + "/todo"
    );

    projectTodoRef
      .add({
        name: categoryName,
        todos: [],
      })
        .then(() => {
          dispatch("addHistory", "Dodano kategorię zadań: " + categoryName)
        })
      .catch((err) => {
        console.log(err);
      });
  },

  bindTodoGroupList: firestoreAction(
    ({ bindFirestoreRef, rootGetters }, projectID) => {
      const projectTodoRef = firebase.firestore.collection(
        "projects/" + projectID + "/todo"
      );

      const serialize = (doc) => {
        let data = doc.data();

        //todo refactor this!
        data.todos.forEach((todo, i) => {
          todo.users.forEach((todoUser, j) => {
            const user = rootGetters.users.find(
              (user) => user.uid === todoUser
            );
            data.todos[i].users[j] = {
              uid: user.uid,
              data: user
                ? user
                : { name: "", imageSrc: rootGetters.userImgPlaceholder },
            };
          });
        });

        Object.defineProperty(data, "id", { value: doc.id });
        Object.defineProperty(data, "_doc", { value: doc });

        return data;
      };

      bindFirestoreRef("todoGroupList", projectTodoRef, {
        serialize,
      }).catch((err) => {
        console.log(err);
      });
    }
  ),
};

export default {
  actions,
  state,
  getters,
  mutations,
};
