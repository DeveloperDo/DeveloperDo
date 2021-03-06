import Vue from "nativescript-vue";
import App from "./pages/App";
import VueDevtools from "nativescript-vue-devtools";
import { firebase } from "@nativescript/firebase";
import routes from "./router";
import sideDrawer from "./components/SideDrawer/sideDrawer";
import drawerContent from "./components/SideDrawer/drawerContent";
import RadListView from "nativescript-ui-listview/vue";
import store from "./store/store";
import Vuelidate from "vuelidate";

Vue.use(Vuelidate);

Vue.use(RadListView);

firebase.init({}).then(
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

Vue.registerElement(
  "Fab",
  () => require("@nstudio/nativescript-floatingactionbutton").Fab
);

Vue.prototype.$routes = routes;
Vue.prototype.$title = "DeveloperDo";
// Vue.config.silent = true;

new Vue({
  store,
  render(h) {
    return h(sideDrawer, [
      h(drawerContent, { slot: "drawerContent" }),
      h(App, { slot: "mainContent" }),
    ]);
  },
}).$start();
