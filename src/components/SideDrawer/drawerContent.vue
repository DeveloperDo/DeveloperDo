<template lang="html">
  <ScrollView height="100%">
    <StackLayout width="100%">
      <Label class="drawer-header" text="Drawer" />

      <Label
        v-for="(page, i) in pages"
        @tap="goToPage(page.component, page.option)"
        class="drawer-item"
        :text="page.name"
        :key="i"
      />

      <Button class="drawer-close-button" @tap="closeDrawer()"
        >Close Drawer</Button
      >
      <Button @tap="logout()">Logout</Button>
    </StackLayout>
  </ScrollView>
</template>

<script>
import sideDrawer from "~/mixins/sideDrawer";

export default {
  mixins: [sideDrawer],
  data() {
    return {
      // define our pages, making sure the component matches that defined in /app/router/index.js
      pages: [
        {name: "Lista Projektów", component: this.$routes.ProjectList, option: { clearHistory: true }},
        {name: "Profil", component: this.$routes.Profile},
      ],
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("signOut").then(() => {
        this.$navigateTo(this.$routes.Login, { clearHistory: true });
      });
    },

    goToPage(pageComponent, options) {
      // use the manual navigation method
      this.$navigateTo(pageComponent, options);
      // and we probably want to close the drawer when changing pages
      this.closeDrawer();
    },
  },

  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
};
</script>

<style lang="css"></style>
