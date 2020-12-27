<template>
  <Page>
    <ActionBar :text="this.$title" />
    <ScrollView height="100%">
      <StackLayout class="register-panel">
        <Label text="" />
        <label
          text="Nazwa użytkownika"
          style="horizontal-align: center; font-size: 20px"
        >
        </label>
        <TextField v-model="name" hint="" class="inputTextSize" />

        <Label text="" />
        <label text="Hasło" style="horizontal-align: center; font-size: 20px">
        </label>
        <TextField
          secure="true"
          v-model="password"
          hint=""
          class="inputTextSize"
        />

        <Label text="" />
        <label
          text="Potwierdź hasło"
          style="horizontal-align: center; font-size: 20px"
        >
        </label>
        <TextField
          secure="true"
          v-model="passwordConfirm"
          hint=""
          class="inputTextSize"
        />

        <Label text="" />
        <label
          text="Adres e-mail"
          style="horizontal-align: center; font-size: 20px"
        >
        </label>
        <TextField v-model="email" hint="" class="inputTextSize" />

        <Label :text="authError" class="errorLabel" textWrap="true" />

        <Label text="" />
        <Button
          :disabled="authIsLoading"
          :class="{ 'btn btn--disabled': authIsLoading }"
          text="Zarejestruj"
          @tap="register"
        />
        <Label text="" />
        <Button text="Powrót" @tap="redirectToLogin" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      password: "",
      passwordConfirm: "",
      email: "",
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
    redirectToLogin() {
      this.$store.commit("resetAuthError");
      this.$navigateTo(this.$routes.Login);
    },

    register() {
      if (this.validate()) {
        return;
      }
      this.$store
        .dispatch("signUp", {
          name: this.name,
          email: this.email.toLowerCase(),
          password: this.password,
        })
        .then(() => {
          if (this.isLogged) {
            this.$store.commit("resetAuthError");
            this.$navigateTo(this.$routes.ProjectList, { clearHistory: true });
          }
        });
    },

    validate() {
      if (this.password !== this.passwordConfirm) {
        this.$store.commit(
          "authError",
          "Hasło i jego potwierdzenie nie są równe"
        );
        return true;
      }
      if (!this.name) {
        this.$store.commit("authError", "Wymagana nazwa użytkownika");
        return true;
      }
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
</style>
