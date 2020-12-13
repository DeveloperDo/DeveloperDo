<template>
  <Page>
    <ActionBar title="DeveloperDo" />
    <ScrollView>
      <StackLayout class="home-panel">
        <!--Add your page content here-->
        <label text="Logowanie" style="horizontal-align: center"> </label>
        <Label text="" />
        <TextField v-model="email" hint="Login" class="inputTextSize" />
        <TextField v-model="password" hint="Haslo" class="inputTextSize" />
        <Label text="" />
        <Button text="Zaloguj" @tap="login" />
        <Label text="" />
        <Button text="Rejestracja" @tap="redirectToRegister" />
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

  methods: {
    redirectToRegister() {
      this.$navigateTo(this.$routes.Register);
    },

    login() {
      this.$store
        .dispatch("signIn", { email: "user@mail.com", password: "qwerqwer" })
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
