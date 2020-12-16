<template>
  <Page>
    <ActionBar title="DeveloperDo" />
    <ScrollView>
      <StackLayout class="register-panel">
        <!--Add your page content here-->
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
  },

  methods: {
    redirectToLogin() {
      this.$navigateTo(this.$routes.Login);
    },

    register() {
      this.$store
        .dispatch("signUp", {
          name: this.name,
          email: this.email.toLowerCase(),
          password: this.password,
        })
        .then(() => {
          if (this.isLogged) {
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
</style>
