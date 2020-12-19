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
  addTodo({}, { projectID, todoGroupID, todo }) {
    const todoGroupRef = firebase.firestore
      .collection("projects/" + projectID + "/todo")
      .doc(todoGroupID);

    todoGroupRef
      .update({
        todos: firebase.firestore.FieldValue.arrayUnion(todo),
      })
      .catch((err) => {
        console.log(err);
      });
  },

  addTodoGroup({}, { projectID, categoryName }) {
    const projectTodoRef = firebase.firestore.collection(
      "projects/" + projectID + "/todo"
    );

    projectTodoRef
      .add({
        name: categoryName,
        todos: [],
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

        data.todos.forEach((todo) => {
          todo.users.forEach((todoUser) => {
            const user = rootGetters.users.find(
              (user) => user.uid === todoUser
            );
            todoUser = user ? user : { name: "", imageSrc: "" };
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
