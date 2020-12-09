<template>
  <Page actionBarHidden="true" class="splashScreenBg" loading="loading">
    <ScrollView>
      <StackLayout class="splashScreen">
        <Label text="Login" class="splashScreenTitle" />
        <button @tap="login">Login</button>

      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
export default {
  data() {
    return {};
  },

  created() {
    console.log(this.$store.getters.sideDrawer);
  },

  methods: {
    login() {
      this.$store.dispatch("signIn", {email: 'user@mail.com', password: "qwerqwer"})
    },
  },
};
</script>

<style scoped>
</style>