<template>
  <ScrollView height="100%">
    <StackLayout class="addProjectModal">
      <Label
        text="Logo projektu"
        textAlignment="center"
        class="addProjectHeader"
      />
      <Image
        :src="getImgSrc"
        stretch="aspectFill"
        class="addProjectPhoto"
        @tap="onSelectSingleTap"
      />

      <Label
        text="Nazwa projektu"
        textAlignment="center"
        class="addProjectHeader"
      />
      <TextField
        v-model="name"
        hint="Wpisz nazwę projektu"
        class="addProjectTextField"
      />

      <Label
        text="Opis projektu"
        textAlignment="center"
        class="addProjectHeader"
      />
      <TextField
        v-model="desc"
        hint="Wpisz opis projektu"
        class="addProjectTextField"
      />

      <Label
        text="Priorytet projektu"
        textAlignment="center"
        class="addProjectHeader"
      />
      <ListPicker :items="listPickerPriority" v-model="priority" />

      <Label
          text="Termin projektu"
          textAlignment="center"
          class="addProjectHeader"
      />
      <DatePicker v-model="deadline" :minDate="today"/>

      <Label v-if="error" :text="error" class="errorLabel" textWrap="true" />

      <Button
        :disabled="validate"
        text="UTWÓRZ PROJEKT"
        @tap="addProject"
        class="addProjectConfirmButton"
        :class="{ 'btn--disabled': validate }"
      />

      <Button
        text="ANULUJ"
        @tap="this.$modal.close"
        class="addProjectConfirmButton"
      />
    </StackLayout>
  </ScrollView>
</template>

<script>
import * as imagepicker from "nativescript-imagepicker";

export default {
  data() {
    return {
      listPickerPriority: ["brak", "niski", "średni", "wysoki"],
      priority: 0,
      name: "",
      desc: "",
      deadline: "",
      isSingleMode: true,
      imageAssets: [],
      imageSrc: null,
      previewSize: 300,
      thumbSize: 80,
      error: null,

      today: Date.now(),
    };
  },

  computed: {
    validate() {
      return this.name === "";
    },

    projectImgPlaceholder: function () {
      return this.$store.getters.projectImgPlaceholder;
    },

    getImgSrc: function () {
      console.log(
        this.imageSrc !== null ? this.imageSrc : this.projectImgPlaceholder
      );

      return this.imageSrc !== null
        ? this.imageSrc
        : this.projectImgPlaceholder;
    },
  },

  methods: {
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

    addProject() {
      if (this.name === "") {
        this.error = "Project needs a name!";
        return;
      } else {
        this.error = null;
      }

      const project = {
        name: this.name,
        desc: this.desc,
        priority: this.priority,
        deadline: this.deadline,
      };

      this.$store
        .dispatch("addProject", {
          project: project,
          image: this.imageAssets[0] ? this.imageAssets[0] : null,
        })
        .then(() => {
          this.$modal.close();
        });
    },
  },
};
</script>

<style scoped>
.addProjectModal {
  margin: 20px;
  vertical-align: center;
  background-color: white;
}

.addProjectHeader {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.addProjectPhoto {
  margin: 50px;
  margin-top: 0;
  height: 500px;
  width: 500px;
  border-radius: 50%;
  android-elevation: 10;
}

.addProjectTextField {
  font-size: 16px;
  margin-bottom: 50px;
}

.addProjectConfirmButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
}
</style>
