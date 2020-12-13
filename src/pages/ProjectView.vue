<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" text="Welcome to NativeScript-Vue!" col="1" />
      </GridLayout>
    </ActionBar>

    <TabView :selectedIndex="selectedIndex">
      <TabViewItem title="Podsumowanie">
        <ScrollView>
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
              <Label :text="project.status" class="projectStatus" />
            </StackLayout>

            <StackLayout
              class="projectPriorityContainer"
              v-bind:class="{
                lowPriority: project.priority === '1',
                mediumPriority: project.priority === '2',
                highPriority: project.priority === '3',
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
          <StackLayout>
            <StackLayout
              v-for="(taskGroup, index) in project.taskGroups"
              :key="index"
              class="projectTasksContainer"
            >
              <Label :text="taskGroup.name" class="projectHeader" />
              <StackLayout
                v-for="(task, index) in taskGroup.tasks"
                :key="index"
                class="taskCard"
              >
                <Label :text="task.name" class="taskText" textWrap="true" />
                <WrapLayout
                  orientation="horizontal"
                  horizontalAlignment="right"
                >
                  <StackLayout v-for="(user, index) in task.users" :key="index">
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
          <ScrollView height="90%">
            <StackLayout class="chatWindow">
              <StackLayout
                v-for="(message, index) in project.chatMessages"
                :key="index"
                class="chatMessageInContainer"
                v-bind:class="{
                  chatMessageOutContainer: message.userID == '1',
                }"
              >
                <Label :text="message.userName" class="messageUsername" />
                <StackLayout
                  class="chatMessageIn"
                  v-bind:class="{ chatMessageOut: message.userID == '1' }"
                  orientation="horizontal"
                >
                  <Image
                    :src="message.userImageSrc"
                    class="userPhoto"
                    stretch="aspectFill"
                  />
                  <Label
                    :text="message.text"
                    textWrap="true"
                    verticalAlignment="center"
                  />
                </StackLayout>
              </StackLayout>
            </StackLayout>
          </ScrollView>

          <StackLayout orientation="horizontal" height="10%">
            <TextField
              v-model="textFieldValue"
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

export default {
  mixins: [sideDrawer],

  methods: {
    onAddTaskButtonTap() {
      console.log("Add task button was pressed");
    },
    onAddTaskGroupButtonTap() {
      console.log("Add task group button was pressed");
    },
    onChangeTap: function (args) {
      console.log("Item with index: " + args.index + " tapped");
    },
    onUsersTap: function (args) {
      console.log("Item with index: " + args.index + " tapped");
    },
  },

  data() {
    return {
      project: {
        imageSrc:
          "https://www.streamscheme.com/wp-content/uploads/2020/07/kekw-emote.jpg",
        name: "SUPER COOL PROJECT NAME!!!!!!",
        status: "do zrobienia",
        priority: "3",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur .Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        users: [
          {
            imageSrc:
              "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
          },
          {
            imageSrc:
              "https://www.pinclipart.com/picdir/middle/324-3242324_free-png-download-open-eye-crying-laughing-emoji.png",
          },
          {
            imageSrc:
              "https://ih1.redbubble.net/image.984211807.4879/ur,mounted_print_canvas_portrait_small_front,square,1000x1000.1.jpg",
          },
          {
            imageSrc:
              "https://media.tenor.com/images/db6a2db8639a596cd5b96ec9c7d0087b/tenor.png",
          },
        ],
        changes: [
          {
            name:
              "Lorem ipsum dolor sit amet coś tam coś tam bla bla blablabla bla bla sa dh gf sa f qhb fuf ds sd kjsd ds age kjr gd kdj fg sdfg et 345r5w",
            date: "12.01.2021",
          },
          {
            name: "W Szczebrzeszynie chrząszcz brzmi w trzcinie",
            date: "17.05.2021",
          },
          {
            name: "Hokus pokus, czary mary, twoja stara to twój stary",
            date: "08.12.2022",
          },
          {
            name: "Change 4",
            date: "01.04.2021",
          },
          {
            name: "Change 5",
            date: "19.11.2021",
          },
          {
            name:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            date: "01.04.2021",
          },
        ],
        taskGroups: [
          {
            name: "Backend",
            tasks: [
              {
                name: "Firebase Fire base Firebase Firebase Fireba se",
                users: [
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                ],
              },
              {
                name: "Laravel",
                users: [
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                ],
              },
              {
                name: "Każdy programista dupa kiedy projektów kupa",
                users: [
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                ],
              },
            ],
          },
          {
            name: "Frontend",
            tasks: [
              {
                name: "Vue",
                users: [
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                  {
                    userImageSrc:
                      "https://i.pinimg.com/originals/5c/99/6e/5c996e6663a3c2ef1b92ad9ef13ffef7.png",
                  },
                ],
              },
              {
                name: "Bootstrap",
                users: [
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                ],
              },
              {
                name:
                  "Lorem ipsum dolor trololololor lololololo lo o lo l ol oretkwghs dg jlsdgh df gd sdlg",
                users: [
                  {
                    userImageSrc:
                      "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                  },
                ],
              },
            ],
          },
        ],
        chatMessages: [
          {
            userID: "1",
            userImageSrc:
              "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
            userName: "lolo",
            text: "okj",
          },
          {
            userID: "2",
            userImageSrc:
              "https://pbs.twimg.com/profile_images/1318131574857150464/2rhjXSCr_400x400.jpg",
            userName: "twoj stary",
            text:
              "heuehuehheuueheueheheuehuehheuueheueheuheuehuehheuueheueheuheuehuehheuueheueheuuheuehuehheuueheueheuheuehuehheuueheueheu",
          },
          {
            userID: "2",
            userImageSrc:
              "https://pbs.twimg.com/profile_images/1318131574857150464/2rhjXSCr_400x400.jpg",
            userName: "twoj stary",
            text:
              "hokus pokus, czary mary, twoja stara to twoj stary... wait a minute",
          },
          {
            userID: "1",
            userImageSrc:
              "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
            userName: "lolo",
            text: "nie no, co ty, tato",
          },
          {
            userID: "3",
            userImageSrc:
              "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/38577360/original/fe4a778310a86b3072d4f2d2c0b1ee38a4e2a3e7/do-a-spoderman-meme-avatar-of-you.png",
            userName: "spoderman",
            text: "lorem ipsum ręce z gipsu",
          },
          {
            userID: "1",
            userImageSrc:
              "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
            userName: "lolo",
            text:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          },
        ],
      },
    };
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
