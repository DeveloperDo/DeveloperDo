<template>
  <Page>
    <ActionBar title="DeveloperDo" />
    <ScrollView>
      <StackLayout class="home-panel">
        <!--Add your page content here-->
        <label text="Logowanie" style="horizontal-align: center"> </label>
        <Label text="" />
        <TextField v-model="email" hint="Login" class="inputTextSize" />
        <TextField
          secure="true"
          v-model="password"
          hint="Haslo"
          class="inputTextSize"
        />
        <Label :text="authError" class="errorLabel" textWrap="true" />
        <Label text="" />
        <Button
          :disabled="authIsLoading"
          :class="{ 'btn btn--disabled': authIsLoading }"
          text="Zaloguj"
          @tap="login"
        />
        <Label text="" />
        <Button text="Do rejestracji" @tap="redirectToRegister" />
        <Label text="" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },

  computed: {
    isLogged: function () {
      return this.$store.getters.isLogged;
    },
    authIsLoading: function () {
      return this.$store.getters.authIsLoading;
    },
    authError: function () {
      return this.$store.getters.getAuthError;
    },
  },

  methods: {
    redirectToRegister() {
      this.$store.commit("resetAuthError");
      this.$navigateTo(this.$routes.Register);
    },

    login() {
      this.$store
        .dispatch("signIn", { email: this.email, password: this.password })
        .then(() => {
          if (this.isLogged) {
            this.$store.commit("resetAuthError");
            this.$navigateTo(this.$routes.ProjectList, { clearHistory: true });
          }
        });
    },
  },
};
</script>

<style scoped>
.home-panel {
  vertical-align: center;
  font-size: 20;
  margin: 15;
}

.inputTextSize {
  font-size: 18px;
}

.description-label {
  margin-bottom: 15;
}

.errorLabel {
  padding: 50px;
  font-size: 18px;
  color: red;
  font-style: italic;
}
</style>
