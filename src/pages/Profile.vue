<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" :text="this.$title" col="1" />
      </GridLayout>
    </ActionBar>

    <ScrollView padding="0" margin="0">
      <StackLayout class="userPanel">
        <Image
          :src="userData.imageSrc"
          class="userImage"
          stretch="aspectFill"
          @tap="onSelectSingleTap"
        />
        <Label :text="userData.name" class="userName" textWrap="true" />
        <Label :text="userData.email" class="userEmail" />

        <Label text="USTAWIENIA" class="header" />

        <StackLayout class="form--margin">
          <TextField
            v-model.lazy.trim="$v.changeName.$model"
            hint="Zmień nazwę"
            class="userSettingsTextField"
            maxLength="40"
            autocorrect="false"
            autocapitalizationType="none"
            @textChange="changeShowEmailErrors"
          />

          <Button
            text="ZMIEŃ NAZWĘ"
            @tap="changeNameAction"
            class="confirmChangesButton"
          />
        </StackLayout>

        <StackLayout class="form--margin">
          <TextField
            v-model.lazy.trim="$v.changeEmail.$model"
            hint="Zmień e-mail"
            class="userSettingsTextField"
            maxLength="40"
            autocorrect="false"
            autocapitalizationType="none"
            @textChange="changeShowEmailErrors"
          />
          <Label
            v-if="
              showEmailErrors && changeEmail !== '' && !$v.changeEmail.email
            "
            text="Błędny format email!"
            class="text--danger text--small"
          />
          <Label
            v-else-if="showEmailErrors && updateEmailError"
            :text="updateEmailError"
            class="text--danger text--small"
          />

          <TextField
            v-model="currentPasswordEmail"
            hint="Aktualne hasło"
            class="userSettingsTextField"
            maxLength="40"
            secure="true"
            required
            autocorrect="false"
            autocapitalizationType="none"
            @textChange="changeShowEmailErrors"
          />
          <Label
            v-if="
              showEmailErrors &&
              currentPasswordEmail === '' &&
              (currentPasswordEmail !== '' || changeEmail !== '')
            "
            text="Ta operacja wymaga potwierdzenia hasła!"
            class="text--danger text--small"
          />
          <Label
            v-else-if="showEmailErrors && updateEmailPasswordError"
            :text="updateEmailPasswordError"
            class="text--danger text--small"
          />

          <Button
            text="ZMIEŃ EMAIL"
            @tap="changeEmailAction"
            class="confirmChangesButton"
          />
        </StackLayout>

        <StackLayout>
          <TextField
            v-model="$v.changePassword.$model"
            hint="Zmień hasło"
            class="userSettingsTextField"
            maxLength="40"
            secure="true"
            autocorrect="false"
            autocapitalizationType="none"
            @textChange="changeShowPasswordErrors"
          />
          <Label
            v-if="
              showPasswordErrors &&
              (!$v.changePassword.minLength || changePassword === '')
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
            @textChange="changeShowPasswordErrors"
          />
          <Label
            v-if="
              showPasswordErrors &&
              changePassword !== '' &&
              !$v.changePasswordConfirm.sameAsPassword
            "
            text="Hasła muszą się zgadzać!"
            class="text--danger text--small"
          />

          <TextField
            v-model="currentPasswordPwd"
            hint="Aktualne hasło"
            class="userSettingsTextField"
            maxLength="40"
            secure="true"
            required
            autocorrect="false"
            autocapitalizationType="none"
            @textChange="changeShowPasswordErrors"
          />
          <Label
            v-if="
              showPasswordErrors &&
              currentPasswordPwd === '' &&
              (changePassword !== '' || changePasswordConfirm !== '')
            "
            text="Ta operacja wymaga potwierdzenia hasła!"
            class="text--danger text--small"
          />
          <Label
            v-else-if="showPasswordErrors && updatePasswordError"
            :text="updatePasswordError"
            class="text--danger text--small"
          />

          <Button
            text="ZMIEŃ HASŁO"
            @tap="changePasswordAction"
            class="confirmChangesButton"
          />
        </StackLayout>

        <StackLayout marginTop="100">
          <TextField
            v-model.lazy.trim="currentPasswordDelete"
            hint="Aktualne hasło"
            class="userSettingsTextField"
            maxLength="40"
            secure="true"
            required
            autocorrect="false"
            autocapitalizationType="none"
            @textChange="changeShowDeleteErrors"
          />
          <Label
            v-if="showDeleteErrors && currentPasswordDelete === ''"
            text="Ta operacja wymaga potwierdzenia hasła!"
            class="text--danger text--small"
          />
          <Label
            v-else-if="showDeleteErrors && deleteUserError"
            :text="deleteUserError"
            class="text--danger text--small"
          />

          <Button
            text="USUŃ KONTO"
            @tap="onDeleteAccountButtonTap"
            class="deleteAccountButton"
          />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import sideDrawer from "../mixins/sideDrawer";
import { minLength, maxLength, sameAs, email } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import * as imagepicker from "nativescript-imagepicker";

export default {
  mixins: [sideDrawer],

  data() {
    return {
      changeName: "",
      changeEmail: "",
      changePassword: "",
      changePasswordConfirm: "",

      currentPasswordDelete: "",
      currentPasswordEmail: "",
      currentPasswordPwd: "",

      showPasswordErrors: false,
      showEmailErrors: false,
      showDeleteErrors: false,

      isSingleMode: true,
      imageAssets: [],
      imageSrc: null,
      previewSize: 300,
      thumbSize: 80,
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
    onSelectSingleTap: function (e) {
      this.isSingleMode = true;
      let context = imagepicker.create({ mode: "single" });
      this.startSelection(context);
    },

    startSelection(context) {
      context
        .authorize()
        .then(() => {
          this.imageAssets = [];
          this.imageSrc = null;
          return context.present();
        })
        .then((selection) => {
          console.log("Selection done: " + JSON.stringify(selection));
          this.imageSrc =
            this.isSingleMode && selection.length > 0 ? selection[0] : null;
          // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
          selection.forEach((element) => {
            element.options.width = this.isSingleMode
              ? this.previewSize
              : this.thumbSize;
            element.options.height = this.isSingleMode
              ? this.previewSize
              : this.thumbSize;
          });
          this.imageAssets = selection;
        })
        .then(() => {
          this.$store.dispatch(
            "changeUserAvatar",
            this.imageAssets[0] ? this.imageAssets[0] : null
          );
        })
        .catch(function (e) {
          console.log(e);
        });
    },

    changeShowEmailErrors() {
      if (this.showEmailErrors) {
        this.$store.commit("resetUserUpdateErrors");
        this.showEmailErrors = false;
      }
    },

    changeShowPasswordErrors() {
      if (this.showPasswordErrors) {
        this.$store.commit("resetUserUpdateErrors");
        this.showPasswordErrors = false;
      }
    },

    changeShowDeleteErrors() {
      if (this.showPasswordErrors) {
        this.$store.commit("resetUserUpdateErrors");
        this.showDeleteErrors = false;
      }
    },

    changeNameAction() {
      if (this.changeName !== "" && !this.$v.changeName.$invalid) {
        this.$store
          .dispatch("updateUserName", {
            userName: { name: this.changeName },
          })
          .then(() => {
            this.$store.dispatch("fetchUserData", { uid: this.userData.uid });
          });
      }
    },

    changeEmailAction() {
      this.showEmailErrors = true;
      this.$store.commit("resetUserUpdateErrors");

      if (
        this.changeEmail !== "" &&
        !this.$v.changeEmail.$invalid &&
        this.currentPasswordEmail
      ) {
        console.log("change email");

        this.$store.dispatch("updateUserEmail", {
          userEmailNew: this.changeEmail,
          userEmailOld: this.userData.email,
          userPassword: this.currentPasswordEmail,
        });
      }
    },

    async changePasswordAction() {
      console.log("update Password");

      this.showPasswordErrors = true;
      this.$store.commit("resetUserUpdateErrors");

      if (
        this.changePassword !== "" &&
        !this.$v.changePassword.$invalid &&
        !this.$v.changePasswordConfirm.$invalid &&
        this.currentPasswordPwd
      ) {
        await this.$store.dispatch("updateUserPassword", {
          userPasswordNew: this.changePassword,
          userPasswordOld: this.currentPasswordPwd,
          userEmail: this.userData.email,
        });
      }
    },

    onDeleteAccountButtonTap() {
      this.showDeleteErrors = true;
      this.$store.commit("resetUserUpdateErrors");

      confirm({
        title: "Usuń konto",
        message: "Jesteś pewny? \n Ta operacja jest nieodwracalna!",
        okButtonText: "Tak, usuń moje konto",
        cancelButtonText: "Anuluj",
      }).then((result) => {
        if (result) {
          this.$store.commit("resetUserUpdateErrors");

          if (this.currentPasswordDelete === "") {
            return;
          }

          this.$store
            .dispatch("deleteUser", {
              email: this.userData.email,
              password: this.currentPasswordDelete,
            })
            .then(() => {
              if (!this.userData) {
                this.$navigateTo(this.$routes.Login, { clearHistory: true });
              }
            });
        }
      });
    },
  },

  computed: {
    ...mapGetters([
      "updateEmailError",
      "updateEmailPasswordError",
      "updatePasswordError",
      "deleteUserError",
    ]),

    userData: function () {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style scoped>
.userPanel {
  horizontal-align: center;
  margin: 0;
  padding: 20;
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

.form--margin {
  margin: 20 0;
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
  width: 100%;
  padding: 0;
  margin-top: 40px;
  color: black;
  background-color: lightgray;
}

.deleteAccountButton {
  width: 100%;
  padding: 0;
  margin-top: 40px;
  color: black;
  background-color: lightcoral;
}
</style>
