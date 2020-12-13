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

  mounted() {
    this.$store.dispatch("authInit").then(() => {
      console.log("authInit");
      console.log(this.isLogged);
      console.log(this.authIsLoading);
      if (this.isLogged) {
        console.log(this.isLogged);
        this.$navigateTo(this.$routes.ProjectList, { clearHistory: true });
      } else {
        console.log(this.isLogged);

        this.$navigateTo(this.$routes.Login, { clearHistory: true });
      }
    });
  },

  computed: {
    isLogged: function () {
      return this.$store.getters.isLogged;
    },
    authIsLoading: function () {
      return this.$store.getters.authIsLoading;
    },
  },

  //
  watch: {
    isLogged: {
      handler(newAuthState) {
        console.log("new auth state");
        console.log(newAuthState);
        // if (newAuthState) {
        //   console.log("Should redirect");
        //   this.$navigateTo(this.$routes.ProjectList, { clearHistory: true });
        // } else {
        //   this.$navigateTo(this.$routes.Login, { clearHistory: true });
        // }
      },
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

.splashScreen {
  width: 90%;
  height: 95%;
  border-radius: 40px;
  vertical-align: center;
  horizontal-align: center;
  background-color: white;

  android-elevation: 10;
}

.splashScreenTitle {
  font-family: monospace;
  font-weight: bold;
  font-size: 30px;
  vertical-align: center;
  horizontal-align: center;
  margin-bottom: 150px;
}

.loadingSpinner {
  animation-name: opacity;
  animation-duration: 1s;
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
