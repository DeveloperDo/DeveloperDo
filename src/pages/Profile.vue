<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" text="Welcome to NativeScript-Vue!" col="1" />
      </GridLayout>
    </ActionBar>

    <ScrollView>
      <StackLayout class="userPanel">
        <Image
          :src="userData.imageSrc"
          class="userImage"
          stretch="aspectFill"
        />
        <Label :text="userData.name" class="userName" textWrap="true" />
        <Label :text="userData.email" class="userEmail" />

        <Label text="USTAWIENIA" class="header" />
        <TextField
          v-model.lazy.trim="$v.changeName.$model"
          hint="Zmień nazwę"
          class="userSettingsTextField"
          maxLength="40"
          autocorrect="false"
          autocapitalizationType="none"
          @textChange="changeShowErrors"
        />

        <TextField
          v-model.lazy.trim="$v.changeEmail.$model"
          hint="Zmień e-mail"
          class="userSettingsTextField"
          maxLength="40"
          autocorrect="false"
          autocapitalizationType="none"
          @textChange="changeShowErrors"
        />
        <Label
          v-if="showErrors && changeEmail !== '' && !$v.changeEmail.email"
          text="Błędny format email!"
          class="text--danger text--small"
        />
        <Label
          v-else-if="showErrors && updateEmailError"
          :text="updateEmailError"
          class="text--danger text--small"
        />

        <TextField
          v-model.lazy.trim="$v.changePassword.$model"
          hint="Zmień hasło"
          class="userSettingsTextField"
          maxLength="40"
          secure="true"
          autocorrect="false"
          autocapitalizationType="none"
          @textChange="changeShowErrors"
        />
        <Label
          v-if="
            showErrors && changePassword !== '' && !$v.changePassword.minLength
          "
          text="Hasło musi być dłuższe niż 6 znaków!"
          class="text--danger text--small"
        />

        <TextField
          v-model.lazy.trim="$v.changePasswordConfirm.$model"
          hint="Potwierdź nowe hasło"
          class="userSettingsTextField"
          maxLength="40"
          secure="true"
          autocorrect="false"
          autocapitalizationType="none"
          @textChange="changeShowErrors"
        />
        <Label
          v-if="
            showErrors &&
            changePassword !== '' &&
            !$v.changePasswordConfirm.sameAsPassword
          "
          text="Hasła muszą się zgadzać!"
          class="text--danger text--small"
        />

        <TextField
          v-model.lazy.trim="currentPassword"
          hint="Aktualne hasło"
          class="userSettingsTextField"
          marginTop="100px"
          maxLength="40"
          secure="true"
          required
          autocorrect="false"
          autocapitalizationType="none"
          @textChange="changeShowErrors"
        />
        <Label
          v-if="
            showErrors &&
            currentPassword === '' &&
            (changePassword !== '' || changeEmail !== '')
          "
          text="Ta operacja wymaga potwierdzenia hasła!"
          class="text--danger text--small"
        />
        <Label
          v-else-if="showErrors && currentPasswordError"
          :text="currentPasswordError"
          class="text--danger text--small"
        />

        <Button
          text="POTWIERDŹ ZMIANY"
          @tap="onConfirmChangesButtonTap"
          class="confirmChangesButton"
        />

        <Button
          text="USUŃ KONTO"
          @tap="onDeleteAccountButtonTap"
          class="deleteAccountButton"
        />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import sideDrawer from "../mixins/sideDrawer";
import { minLength, maxLength, sameAs, email } from "vuelidate/lib/validators";

export default {
  mixins: [sideDrawer],

  data() {
    return {
      changeName: "",
      changeEmail: "",
      changePassword: "",
      changePasswordConfirm: "",
      currentPassword: "",
      showErrors: false,
    };
  },

  validations: {
    changeName: {
      maxLength: maxLength(255),
    },

    changeEmail: {
      email,
      maxLength: maxLength(255),
    },

    changePassword: {
      minLength: minLength(6),
      maxLength: maxLength(255),
    },

    changePasswordConfirm: {
      sameAsPassword: sameAs("changePassword"),
    },
  },

  methods: {
    changeShowErrors() {
      if (this.showErrors) {
        this.$store.commit("resetUserUpdateErrors");
        this.showErrors = false;
      }
    },

    anyErrors() {
      console.log(
        this.changePassword !== "" && !this.$v.changePassword.$invalid
      );
      console.log("ssssas");

      console.log(
        this.changePasswordConfirm !== "" &&
          !this.$v.changePasswordConfirm.$invalid
      );
      console.log("ssssas");

      console.log(this.changeEmail !== "" && !this.$v.changeEmail.$invalid);
      console.log("ssssas");

      console.log(
        (this.changePassword !== "" || this.changeEmail !== "") &&
          this.currentPassword === ""
      );

      console.log("ssssas");

      return (
        //return true if error
        (this.changePassword !== "" && this.$v.changePassword.$invalid) ||
        (this.changePasswordConfirm !== "" &&
          this.$v.changePasswordConfirm.$invalid) ||
        (this.changeEmail !== "" && this.$v.changeEmail.$invalid) ||
        ((this.changePassword !== "" || this.changeEmail !== "") &&
          this.currentPassword === "")
      );
    },

    async onConfirmChangesButtonTap() {
      this.showErrors = true;
      this.$store.commit("resetUserUpdateErrors");

      if (this.anyErrors()) {
        return;
      }

      if (this.changeName !== "" && !this.$v.changeName.$invalid) {
        console.log("change name");
        const userName = {
          name: this.changeName,
        };
        await this.$store.dispatch("updateUserName", { userName: userName });
      }

      if (this.changeEmail !== "" && !this.$v.changeEmail.$invalid) {
        if (this.currentPassword) {
          console.log("change email");

          await this.$store.dispatch("updateUserEmail", {
            userEmailNew: this.changeEmail,
            userEmailOld: this.userData.email,
            userPassword: this.currentPassword,
          });
        }
      }

      if (
        this.changePassword !== "" &&
        !this.$v.changePassword.$invalid &&
        !this.$v.changePasswordConfirm.$invalid
      ) {
        if (this.currentPassword) {
          console.log("update Password");

          await this.$store.dispatch("updateUserPassword", {
            userPasswordNew: this.changePassword,
            userPasswordOld: this.currentPassword,
            userEmail: this.userData.email,
          });
        }
      }

      if (!this.updateEmailError && !this.currentPasswordError) {
        this.resetFields();
      }

      this.$store.dispatch("fetchUserData", { uid: this.userData.uid });
    },

    onDeleteAccountButtonTap() {
      confirm({
        title: "Usuń konto",
        message: "Jesteś pewny? \n Ta operacja jest nieodwracalna!",
        okButtonText: "Tak, usuń moje konto",
        cancelButtonText: "Anuluj",
      }).then((result) => {
        if (result) {
          this.$store.dispatch("deleteUser", {
            email: this.userData.email,
            password: this.currentPassword,
          }).then(() => {
            this.$navigateTo(this.$routes.Login, { clearHistory: true })
          });
        }
      });
    },

    resetFields() {
      this.changeName = "";
      this.changeEmail = "";
      this.changePassword = "";
      this.changePasswordConfirm = "";
      this.currentPassword = "";
    },
  },

  computed: {
    updateEmailError: function () {
      return this.$store.getters.changeEmailError;
    },

    currentPasswordError: function () {
      return this.$store.getters.currentPasswordError;
    },

    userData: function () {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style scoped>
.userPanel {
  horizontal-align: center;
  margin: 50px;
}

.userImage {
  width: 500px;
  height: 500px;
  margin: 40px;
  border-radius: 250px;

  android-elevation: 15;
}

.userName {
  font-size: 26rem;
  font-weight: bold;
  text-align: center;
}

.userEmail {
  font-size: 18rem;
  color: gray;
  text-align: center;
}

.header {
  margin-top: 20;
  font-size: 26rem;
  font-weight: bold;
  text-align: center;
}

.userSettingsTextField {
  font-size: 18px;
  margin-top: 40px;
  vertical-align: center;
  width: 100%;
}

.confirmChangesButton {
  margin-top: 40px;
  color: black;
  background-color: lightgray;
}

.deleteAccountButton {
  margin-top: 80px;
  color: black;
  background-color: lightcoral;
}
</style>
