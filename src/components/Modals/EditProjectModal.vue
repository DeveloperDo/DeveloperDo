<template>
  <ScrollView height="100%">
    <StackLayout class="editProjectModal">
      <Label
        text="Logo projektu"
        textAlignment="center"
        class="editProjectHeader"
      />
      <Image
        :src="getImgSrc"
        stretch="aspectFill"
        class="editProjectPhoto"
        @tap="onSelectSingleTap"
      />

      <Label
        text="Nazwa projektu"
        textAlignment="center"
        class="editProjectHeader"
      />
      <TextField
        v-model="name"
        hint="Wpisz nazwę projektu"
        class="editProjectTextField"
      />

      <Label
        text="Opis projektu"
        textAlignment="center"
        class="editProjectHeader"
      />
      <TextField
        v-model="desc"
        hint="Wpisz opis projektu"
        class="editProjectTextField"
      />

      <Label
        text="Status projektu"
        textAlignment="center"
        class="editProjectHeader"
      />
      <ListPicker :items="listPickerStatus" v-model="status" />

      <Label
        text="Priorytet projektu"
        textAlignment="center"
        class="editProjectHeader"
      />
      <ListPicker :items="listPickerPriority" v-model="priority" />

      <Button
        text="AKTUALIZUJ PROJEKT"
        @tap="editProject"
        class="editProjectConfirmButton"
      />

      <Button
        text="USUŃ PROJEKT"
        @tap="deleteProject"
        class="deleteProjectButton"
      />

      <Button
        text="ANULUJ"
        class="editProjectConfirmButton"
        @tap="this.$modal.close"
      />
    </StackLayout>
  </ScrollView>
</template>

<script>
import * as imagepicker from "nativescript-imagepicker";

export default {
  data() {
    return {
      listPickerStatus: [
        "do zrobienia",
        "w trakcie",
        "wstrzymane",
        "zrobione",
        "wdrożone",
      ],
      status: 0,
      listPickerPriority: ["brak", "niski", "średni", "wysoki"],
      priority: 0,
      name: "",
      desc: "",
      isSingleMode: true,
      imageAssets: [],
      imageSrc: null,
      previewSize: 300,
      thumbSize: 80,
    };
  },

  created() {
    this.name = this.project.name;
    this.desc = this.project.desc;
    this.status = this.project.status;
    this.priority = this.project.priority;
  },

  props: {
    project: Object,
  },

  methods: {
    deleteProject() {
      confirm({
        title: "Potwierdź",
        message: "Czy chcesz usunąć projekt?",
        okButtonText: "OK",
        cancelButtonText: "Anuluj",
      }).then((confirmed) => {
        if (confirmed) {
          this.$navigateTo(this.$routes.ProjectList, {
            clearHistory: true,
          });
          this.$modal.close();
          this.$store.dispatch("deleteProject", this.project.id);
        }
      });
    },

    onSelectSingleTap: function (e) {
      this.isSingleMode = true;
      let context = imagepicker.create({ mode: "single" });
      this.startSelection(context);
    },

    startSelection(context) {
      context
        .authorize()
        .then(() => {
          this.imageAssets = [];
          this.imageSrc = null;
          return context.present();
        })
        .then((selection) => {
          console.log("Selection done: " + JSON.stringify(selection));
          this.imageSrc =
            this.isSingleMode && selection.length > 0 ? selection[0] : null;
          // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
          selection.forEach((element) => {
            element.options.width = this.isSingleMode
              ? this.previewSize
              : this.thumbSize;
            element.options.height = this.isSingleMode
              ? this.previewSize
              : this.thumbSize;
          });
          this.imageAssets = selection;
        })
        .catch(function (e) {
          console.log(e);
        });
    },

    editProject() {
      const project = {
        name: this.name,
        desc: this.desc,
        status: this.status,
        priority: this.priority,
      };

      this.$store
        .dispatch("editProject", {
          project: project,
          projectID: this.project.id,
          projectUsers: this.project.users,
          image: this.imageAssets[0] ? this.imageAssets[0] : null,
        })
        .then(() => {
          this.$modal.close();
        });
    },
  },
  computed: {
    projectImgPlaceholder: function () {
      return this.$store.getters.projectImgPlaceholder;
    },

    getImgSrc: function () {
      return this.imageSrc
        ? this.imageSrc
        : this.project.imageSrc
        ? this.project.imageSrc
        : this.projectImgPlaceholder;
    },
  },
};
</script>

<style scoped>
.editProjectModal {
  margin: 20px;
  vertical-align: center;
  background-color: white;
}

.editProjectHeader {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.editProjectPhoto {
  margin: 50px;
  margin-top: 0;
  height: 500px;
  width: 500px;
  border-radius: 50%;
  android-elevation: 10;
}

.editProjectTextField {
  font-size: 16px;
  margin-bottom: 50px;
}

.editProjectConfirmButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
}

.deleteProjectButton {
  background-color: lightcoral;
  color: white;
  font-size: 18px;
  font-weight: bold;
}
</style>
