<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" text="Welcome to NativeScript-Vue!" col="1" />
      </GridLayout>
    </ActionBar>

    <Spinner v-if="projectListIsLoading" />

    <FlexboxLayout v-else flexDirection="column">
      <ScrollView>
        <StackLayout className="projectList">
          <StackLayout
            v-for="(project, index) in projectList"
            :key="index"
            class="projectCard"
            v-bind:class="{
              lowPriority: project.priority === 1,
              mediumPriority: project.priority === 2,
              highPriority: project.priority === 3,
            }"
            @tap="openProjectView(project)"
          >
            <Label
              :text="project.status"
              class="projectStatus"
              textTransform="uppercase"
            />
            <Image
              :src="project.imageSrc"
              class="projectImg"
              stretch="aspectFill"
            />
            <Label :text="project.name" class="projectName" textWrap="true" />
            <Label :text="project.deadline" class="projectDeadline" />
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <Button
        text="DODAJ PROJEKT"
        @tap="openAddProjectModal"
        class="addProjectButton"
      />
    </FlexboxLayout>
  </Page>
</template>

<script>
import sideDrawer from "../mixins/sideDrawer";
import AddProjectModal from "../components/Modals/AddProjectModal";
import Spinner from "../components/Spinner";

export default {
  components: { Spinner },

  mixins: [sideDrawer],

  methods: {
    openAddProjectModal() {
      this.$showModal(AddProjectModal, { fullscreen: true });
    },

    openProjectView(project) {
      this.$navigateTo(this.$routes.ProjectView, {
        props: { projectID: project.id },
      });
    },
  },

  mounted() {
    this.$store.dispatch("bindProjectList");
  },

  computed: {
    projectListIsLoading: function () {
      return this.$store.getters.projectListIsLoading;
    },
    projectList: function () {
      return this.$store.getters.projectList;
    },
  },
};
</script>

<style scoped lang="scss">
.projectList {
  background-color: white;
}

.projectCard {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 90%;
  horizontal-align: center;
  border-radius: 40px;
  background-color: lightgray;

  android-elevation: 10;
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

.projectStatus {
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}

.projectImg {
  margin-top: 20px;
  margin-bottom: 20px;
  height: 250px;
  width: 400px;
  border-radius: 100px;
  android-elevation: 5;
}

.projectName {
  margin-left: 50px;
  margin-right: 50px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.projectDeadline {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
}

.addProjectButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
  height: 20%;
}
</style>
