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
        <TextField v-model="userName" hint="" class="inputTextSize" />

        <Label text="" />
        <label text="Hasło" style="horizontal-align: center; font-size: 20px">
        </label>
        <TextField v-model="password" hint="" class="inputTextSize" />

        <Label text="" />
        <label
          text="Potwierdź hasło"
          style="horizontal-align: center; font-size: 20px"
        >
        </label>
        <TextField v-model="passwordConfirm" hint="" class="inputTextSize" />

        <Label text="" />
        <label
          text="Adres e-mail"
          style="horizontal-align: center; font-size: 20px"
        >
        </label>
        <TextField v-model="email" hint="" class="inputTextSize" />

        <Label text="" />
        <Button text="Zarejestruj" @tap="register" />
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
      userName: "",
      password: "",
      passwordConfirm: "",
      email: "",
    };
  },

  methods: {
    redirectToLogin() {
      this.$navigateTo(this.$routes.Login);
    },

    register() {
      this.$store
        .dispatch("signUp", {
          userName: this.userName,
          email: this.email.toLowerCase(),
          password: this.password,
        })
        .then(() => {
          this.$navigateTo(this.$routes.ProjectList, { clearHistory: true });
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
