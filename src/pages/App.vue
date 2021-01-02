<template>
  <Page actionBarHidden="true" class="splashScreenBg" loading="loading">
    <SplashScreen />
  </Page>
</template>

<script>
import SplashScreen from "../components/SplashScreen";

export default {
  components: { SplashScreen },
  data() {
    return {};
  },

  async mounted() {
    await Promise.all([
      this.$store.dispatch("fetchPlaceholders"),
      this.$store.dispatch("authInit"),
    ]).then(() => {
      if (this.isLogged) {
        this.$navigateTo(this.$routes.ProjectList, { clearHistory: true });
      } else {
        this.$navigateTo(this.$routes.Login, { clearHistory: true });
      }
    });
  },

  computed: {
    isLogged: function () {
      return this.$store.getters.isLogged;
    },
  },
};
</script>

<style scoped>
.splashScreenBg {
  width: 100%;
  height: 100%;
  background-color: lightgray;
}

@keyframes opacity {
  from {
    opacity: 0.6;
  }

  to {
    opacity: 1;
  }
}
</style>
