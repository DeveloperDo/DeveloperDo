import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import { firebase } from "@nativescript/firebase";

firebase.init({
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}).then(
    function () {
        this.$store.dispatch("fetchMsg");
      console.log("firebase.init done");
    },
    function (error) {
      console.log("firebase.init error: " + error);
    }
);

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store/store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement(
  'RadSideDrawer',
  () => require('nativescript-ui-sidedrawer').RadSideDrawer
)

var listener = {
    onAuthStateChanged: async data => {
        if (data.loggedIn) {
            const user = data.user;
            await store.dispatch("fetchUserData", { uid: user.uid });
        } else {
            await store.dispatch("signOut");
        }
    },
    thisArg: this
};

firebase.addAuthStateListener(listener);

new Vue({
    store,
    render: h => h('frame', [h(App)])
}).$start()

