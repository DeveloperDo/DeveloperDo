<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" :text="this.$title" col="1" />
      </GridLayout>
    </ActionBar>

    <GridLayout rows="auto, *">
      <ScrollView row="1">
        <StackLayout>
          <FlexboxLayout
            alignItems="center"
            justifyContent="flex-end"
            flexDirection="row"
            style="margin-bottom: 0; margin-top: 0; padding: 0"
          >
            <Label text="Edytuj: " class="" />
            <Switch v-model="editEnabled" style="margin-left: 0" />
          </FlexboxLayout>
          <StackLayout
            class="userCard"
            v-for="(user, index) in users"
            :key="index"
          >
            <StackLayout orientation="horizontal">
              <Image
                :src="user.imageSrc"
                stretch="aspectFill"
                class="userPhoto"
              />
              <StackLayout verticalAlignment="center">
                <Label :text="user.name" class="userName" textWrap="true" />
                <Label :text="user.role" class="userRole" textWrap="true" />
              </StackLayout>
            </StackLayout>
            <Button
              v-if="editEnabled && currentUser.uid !== user.uid"
              text="USUŃ Z ZESPOŁU"
              @tap="deleteUser(user.uid)"
              class="deleteUserButton"
              horizontalAlignment="center"
            />
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <fab
        row="1"
        @tap="onAddUserButtonTap"
        icon="res://baseline_add_white_24"
        rippleColor="#f1f1f1"
        class="fab-button"
      ></fab>
    </GridLayout>
  </Page>
</template>

<script>
import AddUsersModal from "../components/Modals/AddUsersModal";
import sideDrawer from "../mixins/sideDrawer";

export default {
  data() {
    return {
      editEnabled: false,
    };
  },

  mixins: [sideDrawer],

  methods: {
    deleteUser(uid) {
      this.$store.dispatch("removeUserFromProject", uid);
    },

    onAddUserButtonTap() {
      this.$showModal(AddUsersModal, {
        fullscreen: true,
      });
    },
  },

  computed: {
    users: function () {
      return this.$store.getters.users;
    },

    currentUser: function () {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style scoped>
.userCard {
  margin-top: 25px;
  margin-bottom: 25px;
  background-color: lightgray;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.userPhoto {
  width: 200px;
  height: 200px;
  margin: 20px;
  border-radius: 100px;
  android-elevation: 10;
}

.userName {
  padding: 10px;
  font-size: 28px;
  font-weight: bold;
}

.userRole {
  padding: 10px;
  font-size: 14px;
  font-style: italic;
}

.addUserButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
  height: 20%;
}

.deleteUserButton {
  background-color: lightcoral;
  color: white;
  font-size: 14px;
  font-weight: bold;
  width: 60%;
  height: 100px;
}
</style>
