<template>
  <ScrollView height="100%">
    <StackLayout class="addTaskModal">
      <Label
        text="Nazwa zadania"
        textAlignment="center"
        class="addTaskHeader"
      />
      <TextField
        v-model="taskName"
        hint="Wpisz nazwę zadania"
        class="addTaskTextField"
      />

      <Label
        text="Przydziel członków projektu do zadania"
        textAlignment="center"
        class="addTaskHeader"
        textWrap="true"
      />
      <SearchBar
        hint="Szukaj członków projektu"
        v-model="searchPhrase"
        class="addTaskSearchUsers"
      />
      <GridLayout
        columns="auto, *, auto"
        v-for="(user, index) in filteredUsers"
        :key="index"
        class="projectUsersList"
      >
        <Image
          col="0"
          :src="user.item.imageSrc"
          stretch="aspectFill"
          class="userPhoto"
        />
        <StackLayout
          col="1"
          verticalAlignment="center"
          class="userTextContainer"
        >
          <Label
            :text="user.item.name"
            class="addUserTaskName text--black"
            textWrap="true"
          />
          <Label
            :text="user.item.role"
            class="addUserTaskRole text--black"
            textWrap="true"
          />
        </StackLayout>
        <Switch
          col="2"
          checked="false"
          color="black"
          backgroundColor="green"
          offBackgroundColor="gray"
          @checkedChange="switchChanged($event, user.item)"
        />
      </GridLayout>

      <Button
        text="DODAJ ZADANIE"
        @tap="addTask"
        class="addTaskConfirmButton"
      />
    </StackLayout>
  </ScrollView>
</template>

<script>
import Fuse from "fuse.js";

export default {
  data() {
    return {
      searchPhrase: "",
      selectedUsers: [],
      taskName: "",
    };
  },

  props: {
    users: Array,
    todoGroupID: String,
    projectID: String,
  },

  methods: {
    switchChanged(event, user) {
      if (event.value) {
        this.selectedUsers.push(user);
      } else {
        this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
      }

      this.selectedUsers.sort((a, b) => {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();

        return textA.localeCompare(textB);
      });
    },

    addTask() {
      if (this.taskName === "") {
        return;
      }

      const users = [];

      this.selectedUsers.forEach((user) => {
        users.push(user.uid);
      });

      const todo = {
        name: this.taskName,
        users: users,
      };
      this.$store
        .dispatch("addTodo", {
          projectID: this.projectID,
          todoGroupID: this.todoGroupID,
          todo,
        })
        .then(() => {
          this.$modal.close();
        });
    },
  },

  computed: {
    filteredUsers: function () {
      const options = {
        keys: ["name"],
      };

      const fuse = new Fuse(this.users, options);

      return fuse.search(this.searchPhrase);
    },
  },
};
</script>

<style scoped>
.addTaskModal {
  margin: 20px;
  vertical-align: center;
}

.addTaskHeader {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.addTaskTextField {
  font-size: 16px;
  margin-bottom: 50px;
}

.projectUsersList {
  border-radius: 20px;
  margin-bottom: 20px;
  android-elevation: 5;
  background-color: lightgray;
}

.userTextContainer {
  width: 40%;
  margin-right: 20px;
}

.addUserTaskName {
  font-size: 16px;
  font-weight: bold;
}

.addUserTaskRole {
  font-size: 12px;
  font-style: italic;
}

.addTaskConfirmButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
}

.addTaskSearchUsers {
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
