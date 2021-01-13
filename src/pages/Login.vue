<template>
  <Page>
    <ActionBar :title="this.$title" />

    <ScrollView height="100%">
      <StackLayout class="home-panel">
        <StackLayout class="input">
          <Label text="Logowanie" class="titleLabel" />
          <TextField
            v-model="$v.email.$model"
            hint="Email"
            class="input__field"
            @textChange="hideErrors"
          />
          <Label
            v-if="showErrors && !$v.email.required"
            text="Pole wymagane!"
            class="text--danger text--small"
            textWrap="true"
          />
        </StackLayout>

        <StackLayout class="input">
          <TextField
            secure="true"
            v-model="$v.password.$model"
            hint="Haslo"
            class="input__field"
            @textChange="hideErrors"
          />
          <Label
            v-if="showErrors && !$v.password.required"
            text="Pole wymagane!"
            class="text--danger text--small"
            textWrap="true"
          />
          <Label
            v-else-if="showErrors && authError"
            :text="authError"
            class="text--danger text--small"
            textWrap="true"
          />
        </StackLayout>

        <StackLayout class="buttonsLayout">
          <Button :isEnabled="!authIsLoading" text="Zaloguj" @tap="login" />
          <Button text="Do rejestracji" @tap="redirectToRegister" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: "",
      password: "",
      showErrors: false,
    };
  },

  validations: {
    email: {
      required,
    },

    password: {
      required,
    },
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
    hideErrors() {
      if (this.showErrors) {
        this.$store.commit("resetAuthError");
        this.showErrors = false;
      }
    },

    redirectToRegister() {
      this.$store.commit("resetAuthError");
      this.$navigateTo(this.$routes.Register);
    },

    login() {
      this.$store.commit("resetAuthError");
      this.showErrors = true;

      if (this.$v.$invalid || this.authIsLoading) {
        return;
      }

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

.titleLabel {
  align-self: center;
  text-align: center;
  font-size: 20px;
  margin-bottom: 30;
}

.input {
  padding: 15;
  maring: 0;
}

.input__field {
  padding: 0;
  margin: 0;
  font-size: 18px;
}

.buttonsLayout {
  padding: 30 0 0;
  margin: 0;
  font-size: 18px;
}
</style>
