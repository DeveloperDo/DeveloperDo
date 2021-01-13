<template>
  <Page>
    <ActionBar :text="this.$title" />
    <ScrollView height="100%">
      <StackLayout class="home-panel">
        <StackLayout class="input">
          <Label text="Rejestracja" class="titleLabel" />

          <TextField
            v-model="$v.name.$model"
            hint="Nazwa"
            class="input__field"
            @textChange="hideErrors"
          />
          <Label
            v-if="showErrors && !$v.name.required"
            text="Pole wymagane"
            class="text--danger text--small"
          />
        </StackLayout>

        <StackLayout class="input">
          <TextField
            secure="true"
            v-model="$v.password.$model"
            hint="Hasło"
            class="input__field"
            @textChange="hideErrors"
          />
          <Label
            v-if="showErrors && !$v.password.required"
            text="Pole wymagane"
            class="text--danger text--small"
          />
          <Label
            v-else-if="showErrors && !$v.password.minLength"
            text="Hasło musi być dłuższe niż 6 znaków"
            class="text--danger text--small"
          />
        </StackLayout>

        <StackLayout class="input">
          <TextField
            secure="true"
            v-model="$v.passwordConfirm.$model"
            hint="Potwierdź hasło"
            class="input__field"
            @textChange="hideErrors"
          />
          <Label
            v-if="showErrors && !$v.passwordConfirm.required"
            text="Pole wymagane"
            class="text--danger text--small"
          />
          <Label
            v-else-if="showErrors && !$v.passwordConfirm.sameAsPassword"
            text="Hasła muszą się zgadzać!"
            class="text--danger text--small"
          />
        </StackLayout>

        <StackLayout class="input">
          <TextField
            v-model="$v.email.$model"
            hint="Email"
            class="input__field"
            @textChange="hideErrors"
          />
          <Label
            v-if="showErrors && authError"
            :text="authError"
            class="text--danger text--small"
            textWrap="true"
          />
          <Label
            v-else-if="showErrors && !$v.email.required"
            text="Pole wymagane"
            class="text--danger text--small"
          />
          <Label
            v-else-if="showErrors && !$v.email.email"
            text="Błędny format email"
            class="text--danger text--small"
          />
        </StackLayout>

        <StackLayout class="buttonsLayout">
          <Button
            :isEnabled="!authIsLoading || !$v.$invalid"
            text="Zarejestruj"
            @tap="register"
          />
          <Button text="Powrót" @tap="redirectToLogin" />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import {
  required,
  minLength,
  maxLength,
  sameAs,
  email,
} from "vuelidate/lib/validators";

export default {
  data() {
    return {
      name: "",
      password: "",
      passwordConfirm: "",
      email: "",
      showErrors: false,
    };
  },

  validations: {
    name: {
      required,
      maxLength: maxLength(255),
    },
    password: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(255),
    },
    passwordConfirm: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(255),
      sameAsPassword: sameAs("password"),
    },
    email: {
      required,
      email,
      maxLength: maxLength(255),
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

    redirectToLogin() {
      this.$store.commit("resetAuthError");
      this.$navigateTo(this.$routes.Login);
    },

    register() {
      this.$store.commit("resetAuthError");
      this.showErrors = true;

      if (this.$v.$invalid || this.authIsLoading) {
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
