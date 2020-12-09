import Vue from 'nativescript-vue'
import App from './pages/App'
import VueDevtools from 'nativescript-vue-devtools'
import { firebase } from "@nativescript/firebase";
import routes from "./router";
import sideDrawer from "./components/SideDrawer/sideDrawer";
import drawerContent from "./components/SideDrawer/drawerContent";

import store from './store/store'
import Login from "./pages/Login";
import ProjectList from "./pages/ProjectList";

firebase.init({
    onAuthStateChanged: function(data) {
        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
        if (data.loggedIn) {
            console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
            store.dispatch("fetchUserData", {uid: data.user.uid});
        } else {
            store.commit("authError", null);
        }
    }
}).then(
    function () {
      console.log("firebase.init done");
    },
    function (error) {
      console.log("firebase.init error: " + error);
    }
);

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement(
  'RadSideDrawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer
)

Vue.prototype.$routes = routes;

Vue.config.silent = true;

new Vue({
    store,
    render (h) {
        return h(
            sideDrawer,
            [
                h(drawerContent, { slot: 'drawerContent' }),
                h(App, { slot: 'mainContent' })
            ]
        )
    }
}).$start()
