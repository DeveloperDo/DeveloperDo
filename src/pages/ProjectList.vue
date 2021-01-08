<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="openDrawer()" col="0" />
        <Label class="title" :text="this.$title" col="1" />
      </GridLayout>
    </ActionBar>

    <Spinner v-if="projectListIsLoading" />

    <GridLayout v-else rows="auto, *">
      <ScrollView row="1" height="100%">
        <StackLayout>
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
              :text="translateStatus(project.status)"
              class="projectStatus text--black"
              textTransform="uppercase"
            />
            <Image
              :src="project.imageSrc"
              class="projectImg"
              stretch="aspectFill"
            />
            <Label :text="project.name" class="projectName text--black" textWrap="true" />
            <Label
              :text="
                project.deadline
                  ? readTimestamp(project.deadline, true)
                  : 'bez terminu'
              "
              class="projectDeadline text--black"
            />
          </StackLayout>
        </StackLayout>
      </ScrollView>
      <fab
        row="1"
        @tap="openAddProjectModal"
        icon="res://baseline_add_white_24"
        rippleColor="#f1f1f1"
        class="fab-button"
      ></fab>
    </GridLayout>
  </Page>
</template>

<script>
import sideDrawer from "../mixins/sideDrawer";
import readTimestamp from "../mixins/readTimestamp";
import AddProjectModal from "../components/Modals/AddProjectModal";
import Spinner from "../components/Spinner";
import translateStatus from "../mixins/translateStatus";

export default {
  components: { Spinner },

  mixins: [sideDrawer, translateStatus, readTimestamp],

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
</style>
