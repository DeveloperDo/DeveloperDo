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
        <Image v-if="userData.imageSrc" :src="userData.imageSrc" class="userImage" stretch="aspectFill" />
        <Image v-if="!userData.imageSrc" src="https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg" class="userImage" stretch="aspectFill" />
        <Label :text="userData.name" class="userName" textWrap="true" />
        <Label :text="userData.email" class="userEmail" />

        <Label text="USTAWIENIA" class="header" />
        <TextField
          v-model="changeNameTextField"
          hint="Zmień nazwę"
          class="userSettingsTextField"
          maxLength="40"
          autocorrect="false"
          autocapitalizationType="none"
        />
        <TextField
          v-model="changeEmailTextField"
          hint="Zmień e-mail"
          class="userSettingsTextField"
          maxLength="40"
          autocorrect="false"
          autocapitalizationType="none"
        />
        <TextField
          v-model="changePasswordTextField"
          hint="Zmień hasło"
          class="userSettingsTextField"
          maxLength="40"
          secure="true"
          autocorrect="false"
          autocapitalizationType="none"
        />
        <TextField
          v-model="confirmPasswordTextField"
          hint="Potwierdź nowe hasło"
          class="userSettingsTextField"
          maxLength="40"
          secure="true"
          autocorrect="false"
          autocapitalizationType="none"
        />

        <TextField
          v-model="currentPasswordTextField"
          hint="Aktualne hasło"
          class="userSettingsTextField"
          marginTop="100px"
          maxLength="40"
          secure="true"
          required
          autocorrect="false"
          autocapitalizationType="none"
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

export default {
  mixins: [sideDrawer],

  methods: {
    onConfirmChangesButtonTap() {
      if (this.changeNameTextField) {
        const userName = {
          name: this.changeNameTextField
        };
        this.$store.dispatch("updateUserName", { userName: userName } );
      }

      if (this.changeEmailTextField) {
        if (this.currentPasswordTextField) {
          //
        } else {
          alert("Zmiana adresu e-mail wymaga hasła!");
          return;
        }
      }

      if (this.changePasswordTextField) {
        if (this.changePasswordTextField === this.confirmPasswordTextField) {
          if (this.changePasswordTextField.length > 7) {
            //
          } else {
            alert("Hasło musi składać się z co najmniej 8 znaków!");
            return;
          }
        } else {
          alert("Nowe hasło i potwierdzenie hasła nie są takie same!");
          return;
        }
      }

      this.$store.dispatch("fetchUserData", {uid: this.userData.uid});
    },

    onDeleteAccountButtonTap() {
      console.log("Delete account button was pressed");
    },
  },

  data() {
    return {
      changeNameTextField: "",
      changeEmailTextField: "",
      changePasswordTextField: "",
      confirmPasswordTextField: "",
      currentPasswordTextField: "",
    };
  },

  computed: {
    userData: function () {
      return this.$store.getters.getUser;
    }
  }
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
  margin-top: 175vh;
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
