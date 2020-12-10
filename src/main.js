import Vue from "nativescript-vue";
import App from "./pages/App";
import VueDevtools from "nativescript-vue-devtools";
import { firebase } from "@nativescript/firebase";
import routes from "./router";
import sideDrawer from "./components/SideDrawer/sideDrawer";
import drawerContent from "./components/SideDrawer/drawerContent";

import store from "./store/store";

firebase
  .init({
    onAuthStateChanged: async function (data) {
      console.log("onAuthStateChange");

      if (data.loggedIn) {
        console.log("logged in");
        await store.dispatch("fetchUserData", { uid: data.user.uid });
      } else {
        console.log("not logged in");
        store.commit("authSignOut");
      }
    },
  })
  .then(
    function () {
      console.log("firebase.init done");
    },
    function (error) {
      console.log("firebase.init error: " + error);
    }
  );

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}

Vue.config.silent = TNS_ENV === "production";

Vue.registerElement(
  "RadSideDrawer",
  () => require("nativescript-ui-sidedrawer").RadSideDrawer
);

Vue.prototype.$routes = routes;

Vue.config.silent = true;

new Vue({
  store,
  render(h) {
    return h(sideDrawer, [
      h(drawerContent, { slot: "drawerContent" }),
      h(App, { slot: "mainContent" }),
    ]);
  },
}).$start();
