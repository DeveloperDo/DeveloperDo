<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" text="Welcome to NativeScript-Vue!" col="1" />
      </GridLayout>
    </ActionBar>

    <TabView @selectedIndexChange="selectedIndexChange">
      <TabViewItem title="Podsumowanie">
        <ScrollView>
          <spinner v-if="changesIsLoading" />

          <StackLayout v-else>
            <StackLayout class="projectNameContainer">
              <Image
                :src="project.imageSrc"
                class="projectImg"
                stretch="aspectFill"
              />
              <Label :text="project.name" class="projectName" textWrap="true" />
            </StackLayout>

            <StackLayout class="projectStatusContainer">
              <Label text="STATUS" class="projectHeader" />
              <Label :text="project.status" class="projectStatus" />
            </StackLayout>

            <StackLayout
              class="projectPriorityContainer"
              v-bind:class="{
                lowPriority: project.priority === 1,
                mediumPriority: project.priority === 2,
                highPriority: project.priority === 3,
              }"
            >
              <Label text="PRIORYTET" class="projectHeader" />
              <Label :text="project.priority" class="projectPriority" />
            </StackLayout>

            <StackLayout class="projectDescriptionContainer">
              <Label text="OPIS PROJEKTU" class="projectHeader" />
              <Label
                :text="project.description"
                class="projectDescription"
                textWrap="true"
              />
            </StackLayout>

            <StackLayout class="projectUsersContainer">
              <Label text="ZESPÓŁ" class="projectHeader" />
              <WrapLayout orientation="horizontal" class="usersList">
                <StackLayout
                  v-for="(user, index) in project.users"
                  :key="index"
                  @tap="onUsersTap"
                >
                  <Image
                    :src="user.imageSrc"
                    stretch="aspectFill"
                    class="userPhoto"
                  />
                </StackLayout>
              </WrapLayout>
            </StackLayout>

            <StackLayout class="projectChangesContainer">
              <Label text="HISTORIA ZMIAN" class="projectHeader" />
              <StackLayout
                v-for="(change, index) in project.changes"
                :key="index"
                @tap="onChangeTap"
                class="changeCard"
              >
                <Label :text="change.name" class="changeText" textWrap="true" />
                <Label horizontalAlignment="right" :text="change.date" />
              </StackLayout>
            </StackLayout>
          </StackLayout>
        </ScrollView>
      </TabViewItem>

      <TabViewItem title="Zadania">
        <ScrollView>
          <Spinner v-if="todoGroupListIsLoading" />

          <StackLayout v-else>
            <StackLayout
              v-for="(todoGroup, index) in todoGroupList"
              :key="index"
              class="projectTasksContainer"
            >
              <Label :text="todoGroup.name" class="projectHeader" />
              <StackLayout
                v-for="(task, index) in todoGroup.todos"
                :key="index"
                class="taskCard"
              >
                <Label :text="task.name" class="taskText" textWrap="true" />
                <WrapLayout
                  orientation="horizontal"
                  horizontalAlignment="right"
                >
                  <StackLayout v-for="(user, index) in task.users" :key="index">
                    <!--                    TODO fetching user avatar-->
                    <Image
                      :src="user.userImageSrc"
                      class="userTaskPhoto"
                      stretch="aspectFill"
                    />
                  </StackLayout>
                </WrapLayout>
              </StackLayout>
              <Button
                text="DODAJ ZADANIE"
                @tap="onAddTaskButtonTap"
                class="addTaskButton"
              />
            </StackLayout>

            <Button
              text="DODAJ KATEGORIE"
              @tap="onAddTaskGroupButtonTap"
              class="addTaskGroupButton"
            />
          </StackLayout>
        </ScrollView>
      </TabViewItem>

      <TabViewItem title="Czat">
        <FlexboxLayout flexDirection="column">
          <Spinner v-if="chatIsLoading" />

          <ScrollView height="90%" v-if="!chatIsLoading">
            <StackLayout class="chatWindow">
              <StackLayout
                v-for="(msg, index) in chat"
                :key="index"
                class="chatMessageInContainer"
                :class="{
                  chatMessageOutContainer: ownMsg(msg.userID),
                }"
              >
                <!--                TODO user name-->
                <Label :text="userName" class="messageUsername" />
                <StackLayout
                  class="chatMessageIn"
                  v-bind:class="{ chatMessageOut: ownMsg(msg.userID) }"
                  orientation="horizontal"
                >
                  <!--                  TODO getUserImage-->
                  <Image
                    :src="msg.userImageSrc"
                    class="userPhoto"
                    stretch="aspectFill"
                  />
                  <Label
                    :text="msg.text"
                    textWrap="true"
                    verticalAlignment="center"
                  />
                </StackLayout>
              </StackLayout>
            </StackLayout>
          </ScrollView>

          <StackLayout
            orientation="horizontal"
            height="10%"
            v-if="!chatIsLoading"
          >
            <TextField
              v-model="msgTextField"
              hint="Napisz wiadomość"
              width="65%"
              class="chatTextField"
            />
            <Button
              text="Wyślij"
              @tap="onButtonTap"
              width="25%"
              class="chatSendMessageButton"
            />
          </StackLayout>
        </FlexboxLayout>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import sideDrawer from "../mixins/sideDrawer";
import { mapGetters } from "vuex";
import Spinner from "../components/Spinner";
import AddTodoGroupModal from "../components/Modals/AddTodoGroupModal";
import AddTodoModal from "../components/Modals/AddTodoModal";

export default {
  components: { Spinner },
  data() {
    return {
      currentIndex: 0,
      chatInitialised: false,
      todoInitialised: false,
      event: "",
      msgTextField: "",
    };
  },

  mixins: [sideDrawer],

  created() {
    this.$store.dispatch("fetchChanges");
  },

  props: {
    project: Object,
  },

  methods: {
    selectedIndexChange(event) {
      this.currentIndex = event.value;

      if (this.currentIndex === 1 && !this.todoInitialised) {
        this.$store.dispatch("fetchTodoGroupList", this.project.id);
        this.todoInitialised = true;
      } else if (this.currentIndex === 2 && !this.chatInitialised) {
        this.$store.dispatch("fetchChat", { projectID: this.project.id });
        this.chatInitialised = true;
      }
    },
    onAddTaskButtonTap() {
      this.$showModal(AddTodoModal);
    },
    onAddTaskGroupButtonTap() {
      this.$showModal(AddTodoGroupModal, {
        props: { projectID: this.project.id },
      });
    },
    onChangeTap: function (args) {
      console.log("Item with index: " + args.index + " tapped");
    },
    onUsersTap: function (args) {
      console.log("Item with index: " + args.index + " tapped");
    },
    ownMsg(userID) {
      return userID === this.getUser.uid;
    },
  },

  computed: {
    ...mapGetters([
      "todoGroupList",
      "todoGroupListIsLoading",
      "chat",
      "chatIsLoading",
      "getUser",
      "changes",
      "changesIsLoading",
    ]),
  },
};
</script>

<style scoped>
.projectNameContainer {
  horizontal-align: center;
}

.projectImg {
  margin-top: 50px;
  margin-bottom: 50px;
  height: 500px;
  width: 500px;
  border-radius: 50%;
  android-elevation: 10;
}

.projectName {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.projectStatusContainer {
  margin-top: 50px;
  background-color: lightgray;
  horizontal-align: center;
  vertical-align: center;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.projectHeader {
  margin-bottom: 10px;
  font-size: 24px;
  text-align: center;
}

.projectStatus {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.projectPriorityContainer {
  margin-top: 20px;
  background-color: lightgray;
  horizontal-align: center;
  vertical-align: center;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.projectPriority {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.lowPriority {
  background-color: lightgreen;
}

.mediumPriority {
  background-color: khaki;
}

.highPriority {
  background-color: lightcoral;
}

.projectDescriptionContainer {
  margin-top: 50px;
}

.projectDescription {
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 50px;
  font-size: 18px;
}

.projectUsersContainer {
  margin-top: 20px;
  background-color: lightgray;
  horizontal-align: center;
  vertical-align: center;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.usersList {
  horizontal-align: center;
  vertical-align: center;
}

.userPhoto {
  width: 100px;
  height: 100px;
  margin: 20px;
  border-radius: 50px;
  android-elevation: 10;
}

.projectChangesContainer {
  margin-top: 50px;
  background-color: lightgray;
  horizontal-align: center;
  vertical-align: center;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.changeCard {
  width: 95%;
  padding: 15px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  androud-elevation: 5;
}

.changeText {
  width: 95%;
  font-size: 18px;
}

.changeDate {
  font-size: 14px;
}

.projectTasksContainer {
  margin-top: 50px;
  background-color: lightgray;
  horizontal-align: center;
  vertical-align: center;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.taskCard {
  width: 95%;
  padding: 15px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  androud-elevation: 5;
}

.taskText {
  width: 95%;
  font-size: 18px;
  vertical-align: center;
}

.userTaskPhoto {
  width: 50px;
  height: 50px;
  margin: 5px;
  border-radius: 50px;
  android-elevation: 5;
}

.addTaskButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
  height: 20%;
}

.addTaskGroupButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
  height: 20%;
}

.chatWindow {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 90%;
}

.chatMessageInContainer {
  horizontal-align: left;
}

.chatMessageOutContainer {
  horizontal-align: right;
  text-align: right;
}

.chatMessageIn {
  padding: 20px;
  margin-bottom: 20px;
  background-color: lightgray;
  font-size: 16px;
  border-radius: 50px;
  horizontal-align: left;
}

.chatMessageOut {
  padding: 20px;
  margin-bottom: 20px;
  background-color: dodgerblue;
  color: white;
  font-size: 16px;
  border-radius: 50px;
  horizontal-align: right;
}

.messageUsername {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 12px;
  color: gray;
}

.chatTextField {
  padding-right: 0;
  margin-right: 0;
}

.chatSendMessageButton {
  background-color: lightgray;
  color: black;
  font-weight: bold;
}
</style>
