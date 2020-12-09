export default {
    data () {
        return {
            // we'll use this to enable gestures on our sideDrawer.
            gesturesEnabled: false
        }
    },
    computed: {
        // drawerElement points to the drawer node using vue $refs
        drawerElement () { return (this.$refs && this.$refs.drawer) || null },
        // drawer is responsible for getting and setting the sideDrawer property in vuex state.
        drawer: {
            get () { return this.$store.getters.sideDrawer },
            set (v) { return this.$store.commit('setSideDrawer', v) }
        }
    },
    watch: {
        // we watch the drawer prop for changes and open/close the sideDrawer accordingly
        drawer (v) {
            if (this.drawerElement) {
                return v ?
                    this.drawerElement.nativeView.showDrawer() :
                    this.drawerElement.nativeView.closeDrawer()
            }
        }
    },
    methods: {
        openDrawer () {
            console.log("open side drawer");
            this.drawer = true
        },
        closeDrawer () {
            console.log("close side drawer")
            this.drawer = false
        }
    }
}