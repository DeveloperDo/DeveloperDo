<template>
  <ScrollView>
    <StackLayout class="addTaskModal">
      <Label
        text="Nazwa zadania"
        textAlignment="center"
        class="addTaskHeader"
      />
      <TextField
        v-model="taskNameTextField"
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
        @submit="onSearchSubmit"
        class="addTaskSearchUsers"
      />
      <StackLayout
        v-for="(user, index) in filteredUsers"
        :key="index"
        class="projectUsersList"
        orientation="horizontal"
      >
        <Image
          :src="user.item.imageSrc"
          stretch="aspectFill"
          class="userPhoto"
        />
        <StackLayout verticalAlignment="center" class="userTextContainer">
          <Label
            :text="user.item.name"
            class="addUserTaskName"
            textWrap="true"
          />
          <Label
            :text="user.item.role"
            class="addUserTaskRole"
            textWrap="true"
          />
        </StackLayout>
        <Switch
          checked="false"
          color="black"
          backgroundColor="green"
          offBackgroundColor="gray"
        />
      </StackLayout>

      <Button
        text="DODAJ ZADANIE"
        @tap="onAddTaskConfirmButtonTap"
        class="addTaskConfirmButton"
      />
    </StackLayout>
  </ScrollView>
</template>

<script>
import Fuse from "fuse.js";

export default {
  methods: {
    onSearchSubmit(args) {
      let searchBar = args.object;
      console.log("You are searching for " + searchBar.text);
    },

    onAddTaskConfirmButtonTap() {
      console.log("Task added!");
    },
  },

  data() {
    return {
      searchPhrase: "",

      project: {
        users: [
          {
            name: "biggus dickus",
            role: "programista backend",
          },
          {
            name: "mike hunt",
            role: "programista frontend",
          },
          {
            name: "Lorem Ipsum",
            role: "tester",
          },
          {
            name: "Cyberbug 2077",
            role: "PR manager",
          },
          {
            name: "p",
            role: "t",
          },
          {
            name: "Lorem ipsum dolor sit amet dfgjdfg dflkg sdlkf",
            role: "123 hife ds kdsng kdfs sd",
          },
        ],
      },

      taskNameTextField: "",
    };
  },

  computed: {
    filteredUsers: function () {
      const options = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        keys: ["name"],
      };

      const fuse = new Fuse(this.project.users, options);

      const search = fuse.search(this.searchPhrase);
      console.log(search);
      return search;
    },
  },
};
</script>

<style scoped>
.userPhoto {
  max-width: 100%;
  max-height: 100%;
}

.addTaskModal {
  margin: 20px;
  vertical-align: center;
  background-color: white;
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
  background-color: lightgray;
  border-radius: 20px;
  margin-bottom: 20px;
  android-elevation: 5;
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
