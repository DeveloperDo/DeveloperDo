<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" :text="this.$title" col="1" />
      </GridLayout>
    </ActionBar>

    <Spinner v-if="projectIsLoading" />

    <TabView v-else>
      <TabViewItem title="Podsumowanie">
        <ScrollView class="h-100">
          <StackLayout>
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
              <Label
                :text="translateStatus(project.status)"
                class="projectStatus"
              />
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
              <Label
                :text="translatePriority(project.priority)"
                class="projectPriority"
              />
            </StackLayout>

            <StackLayout class="projectDeadlineContainer">
              <Label text="DEADLINE" class="projectHeader" />
              <Label
                :text="
                  project.deadline
                    ? readTimestamp(project.deadline, true)
                    : 'bez terminu'
                "
                class="projectDeadline"
                textWrap="true"
              />
            </StackLayout>

            <StackLayout class="projectDescriptionContainer">
              <Label text="OPIS PROJEKTU" class="projectHeader" />
              <Label
                :text="project.desc"
                class="projectDescription"
                textWrap="true"
              />
            </StackLayout>

            <StackLayout class="projectUsersContainer" @tap="onUsersTap">
              <Label text="ZESPÓŁ" class="projectHeader" />
              <WrapLayout orientation="horizontal" class="usersList">
                <StackLayout v-for="(user, index) in users" :key="index">
                  <Image
                    :src="user.imageSrc"
                    stretch="aspectFill"
                    class="userPhoto"
                  />
                </StackLayout>
              </WrapLayout>
            </StackLayout>

            <StackLayout class="editButtonContainer">
              <Button
                text="EDYTUJ PROJEKT"
                @tap="onEditButtonTap"
                class="editButton"
              />
            </StackLayout>

            <StackLayout class="projectChangesContainer">
              <Label text="HISTORIA ZMIAN" class="projectHeader" />
              <StackLayout
                v-for="(change, index) in changes"
                :key="index"
                @tap="onChangeTap"
                class="changeCard"
              >
                <Label :text="change.name" class="changeText" textWrap="true" />
                <Label
                  horizontalAlignment="right"
                  :text="readTimestamp(change.timestamp)"
                />
              </StackLayout>
            </StackLayout>
          </StackLayout>
        </ScrollView>
      </TabViewItem>

      <TabViewItem title="Zadania" visibility="collapse">
        <ScrollView class="h-100">
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
              v-for="(todoGroup, index) in todoGroupList"
              :key="index"
              class="projectTasksContainer"
            >
              <Label :text="todoGroup.name" class="projectHeader" />
              <FlexboxLayout
                v-for="(task, index) in todoGroup.todos"
                :key="index"
                class="taskCard"
                flexDirection="row"
              >
                <FlexboxLayout padding="20px" flexDirection="column">
                  <Label :text="task.name" class="taskText" textWrap="true" />
                  <WrapLayout orientation="horizontal" alignSelf="flex-end">
                    <StackLayout
                      v-for="(user, index) in task.users"
                      :key="index"
                    >
                      <Image
                        :src="user.data.imageSrc"
                        class="userTaskPhoto"
                        stretch="aspectFill"
                      />
                    </StackLayout>
                  </WrapLayout>
                </FlexboxLayout>
                <StackLayout width="40%">
                  <FlexboxLayout height="100%">
                    <Button
                      text="X"
                      class="deleteTaskButton"
                      @tap="deleteTodo(todoGroup.id, task)"
                    ></Button>
                  </FlexboxLayout>
                </StackLayout>
              </FlexboxLayout>
              <Button
                text="DODAJ ZADANIE"
                @tap="onAddTaskButtonTap(todoGroup.id)"
                class="addTaskButton"
              />
              <Button
                v-if="editEnabled"
                text="USUŃ KATEGORIĘ"
                @tap="deleteTodoGroup(todoGroup.id, todoGroup.name)"
                class="deleteTaskGroupButton"
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
          <ScrollView height="90%">
            <StackLayout class="chatWindow">
              <StackLayout
                v-for="(msg, index) in chat"
                :key="index"
                class="chatMessageInContainer"
                :class="{
                  chatMessageOutContainer: ownMsg(msg.uid),
                }"
              >
                <Label :text="msg.user.name" class="messageUsername" />
                <StackLayout
                  class="chatMessageIn"
                  v-bind:class="{ chatMessageOut: ownMsg(msg.uid) }"
                  orientation="horizontal"
                >
                  <Image
                    :src="msg.user.imageSrc"
                    class="userPhoto"
                    stretch="aspectFill"
                  />
                  <Label
                    :text="msg.text"
                    textWrap="true"
                    verticalAlignment="center"
                  />
                </StackLayout>
                <Label
                    :text="readTimestamp(msg.timestamp, false)"
                    class="messageTimestamp"
                />
              </StackLayout>
            </StackLayout>
          </ScrollView>

          <StackLayout orientation="horizontal" height="10%">
            <TextField
              v-model="msgTextField"
              hint="Napisz wiadomość"
              width="65%"
              class="chatTextField"
            />
            <Button
              text="Wyślij"
              @tap="msgSendButton"
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
import EditProjectModal from "../components/Modals/EditProjectModal";
import translateStatus from "../mixins/translateStatus";
import translatePriority from "../mixins/translatePriority";
import readTimestamp from "../mixins/readTimestamp";

export default {
  components: { Spinner },

  data() {
    return {
      editEnabled: false,
      currentIndex: 0,
      chatInitialised: false,
      todoInitialised: false,
      event: "",
      msgTextField: "",
      todoGroupListID: "",
    };
  },

  mixins: [sideDrawer, translateStatus, translatePriority, readTimestamp],

  mounted() {
    this.$store.dispatch("bindProject", this.projectID);
  },

  props: {
    projectID: String,
  },

  methods: {
    deleteTodo(todoGroupID, task) {
      this.$store.dispatch("deleteTodo", {
        projectID: this.project.id,
        todoGroupID: todoGroupID,
        todo: task,
      });
    },

    deleteTodoGroup(todoGroupID, todoGroupName) {
      this.$store.dispatch("deleteTodoGroup", {
        projectID: this.project.id,
        todoGroupID: todoGroupID,
        todoGroupName: todoGroupName,
      });
    },

    onEditButtonTap() {
      this.$showModal(EditProjectModal, {
        fullscreen: true,
        props: {
          project: this.project,
        },
      });
    },

    onAddTaskButtonTap(todoGroupID) {
      this.$showModal(AddTodoModal, {
        props: {
          users: this.users,
          todoGroupID: todoGroupID,
          projectID: this.project.id,
        },
      });
    },

    onAddTaskGroupButtonTap() {
      this.$showModal(AddTodoGroupModal, {
        props: { projectID: this.project.id },
      });
    },

    msgSendButton() {
      if (this.msgTextField !== "") {

        const message = {
          uid: this.getUser.uid,
          text: this.msgTextField,
        };

        this.$store.dispatch("sendMessage", {message: message, projectID: this.project.id})

        this.msgTextField = ""
      }
    },

    onChangeTap: function (args) {
      console.log("Item with index: " + args.index + " tapped");
    },

    onUsersTap() {
      this.$navigateTo(this.$routes.ProjectUsers);
    },

    ownMsg(userID) {
      return userID === this.getUser.uid;
    },
  },

  computed: {
    ...mapGetters([
      "todoGroupList",
      "chat",
      "getUser",
      "changes",
      "users",
      "projectIsLoading",
      "project",
    ]),
  },
};
</script>

<style scoped>
.h-100 {
  height: 100%;
}

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
  text-align: center;
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
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  androud-elevation: 5;
}

.taskText {
  width: 100%;
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

.messageTimestamp {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 12px;
  color: gray;
}

.chatTextField {
  font-size: 16px;
  padding-right: 0;
  margin-right: 0;
}

.chatSendMessageButton {
  background-color: lightgray;
  color: black;
  font-weight: bold;
}

.editButtonContainer {
  vertical-align: center;
  horizontal-align: center;
  margin-top: 50px;
}

.editButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
  width: 90%;
  height: 150px;
}

.deleteTaskButton {
  font-size: 18px;
  font-weight: bold;
  background-color: lightcoral;
  color: white;
}

.deleteTaskGroupButton {
  font-size: 18px;
  height: 20%;
  font-weight: bold;
  background-color: lightcoral;
  color: white;
}

.projectDeadlineContainer {
  margin-top: 20px;
  background-color: #92d7e0;
  horizontal-align: center;
  vertical-align: center;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.projectDeadline {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
</style>
