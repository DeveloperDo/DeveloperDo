<template>
  <ScrollView height="100%">
    <StackLayout class="addUsersModal">
      <Label
        text="Przydziel użytkowników do projektu"
        textAlignment="center"
        class="addUsersHeader"
        textWrap="true"
      />
      <SearchBar
        v-model.trim="searchString"
        hint="Wpisz email"
        @submit="searchUser"
        class="addUsersSearch"
      />
      <StackLayout v-if="searchUsersIsLoading">
        <Spinner />
      </StackLayout>

      <GridLayout
        v-else
        v-for="(user, index) in foundUsers"
        :key="index"
        class="usersSearchList"
        rows="auto"
        columns="auto, *, auto"
      >
        <Image
          :src="user.imageSrc"
          stretch="aspectFill"
          class="userPhoto"
          row="0"
          col="0"
        />
        <StackLayout
          row="0"
          col="1"
          verticalAlignment="center"
          class="userTextContainer"
        >
          <Label :text="user.name" class="addUserName" textWrap="true" />
        </StackLayout>
        <Switch
          row="0"
          col="3"
          :checked="userSelected(user)"
          color="black"
          backgroundColor="green"
          offBackgroundColor="gray"
          @checkedChange="onSwitchChange($event, user)"
        />
      </GridLayout>

      <Button
        text="DODAJ UŻYTKOWNIKÓW"
        :disabled="selectedUsers.length === 0"
        @tap="onAddUsersButtonTap"
        class="button"
      />
    </StackLayout>
  </ScrollView>
</template>

<script>
import Spinner from "../Spinner";

export default {
  components: { Spinner },

  data() {
    return {
      searchString: "",
      selectedUsers: [],
    };
  },

  methods: {
    onSwitchChange(e, selectedUser) {
      if (e.value) {
        this.selectedUsers.push(selectedUser.uid);
      } else {
        this.selectedUsers.forEach((user, index) => {
          if (user === selectedUser.uid) {
            this.selectedUsers.splice(index, 1);
          }
        });
      }
    },
    searchUser() {
      this.$store.dispatch("searchUser", this.searchString);
    },
    onAddUsersButtonTap() {
      if (this.selectedUsers.length === 0) return;
      this.$store.dispatch("addUsersToProject", this.selectedUsers).then(() => {
        this.$store.commit("resetSearchUsers");
        this.$modal.close();
      });
    },
    userSelected(selectedUser) {
      return this.selectedUsers.some((user) => user === selectedUser.uid);
    },
  },

  computed: {
    foundUsers: function () {
      return this.$store.getters.foundUsers;
    },
    searchUsersIsLoading: function () {
      return this.$store.getters.searchUsersIsLoading;
    },
  },
};
</script>

<style scoped>
.addUsersModal {
  margin: 20px;
  vertical-align: center;
  background-color: white;
}

.addUsersHeader {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.addUsersSearch {
  font-size: 14px;
  margin-bottom: 20px;
}

.usersSearchList {
  background-color: lightgray;
  border-radius: 20px;
  margin-bottom: 20px;
  android-elevation: 5;
}

.addUserName {
  font-size: 16px;
  font-weight: bold;
}

.button {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
}
</style>
