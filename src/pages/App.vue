<template>
  <Page actionBarHidden="true" class="splashScreenBg" loading="loading">
    <ScrollView>
      <StackLayout class="splashScreen">
        <Label text="DeveloperDo" class="splashScreenTitle" />
        <button @tap="login">Login</button>
        <ActivityIndicator busy="true" color="black" width="150"
                           height="150" class="loadingSpinner"></ActivityIndicator>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>

export default {
  data() {
    return {};
  },

  computed: {
    isLogged: function () {
      return this.$store.getters.isLogged;
    },
    authIsLoading: function () {
      return this.$store.getters.authIsLoading;
    }
  },

  methods: {
    login() {
      this.$store.dispatch("signIn", {email: 'user@mail.com', password: "qwerqwer"})
    },
  },

  watch: {
    authIsLoading: function (newState, oldState) {
      console.log(newState)
    },

    isLogged: {
      handler(newAuthState, oldState) {
        if (newAuthState) {
          this.$navigateTo(this.$routes.ProjectList);
        } else {
          this.$navigateTo(this.$routes.Login);
        }
      }
    }
  }
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