<template>
    <ScrollView>
        <StackLayout class="addProjectModal">

            <Label text="Zdjęcie projektu" textAlignment="center"
                class="addProjectHeader" />
            <Image
                src="https://altimadental.pl/wp-content/uploads/2015/01/default-placeholder.png"
                stretch="aspectFill" class="addProjectPhoto"
                @tap="onAddProjectImageButtonTap" />

            <Label text="Nazwa projektu" textAlignment="center"
                class="addProjectHeader" />
            <TextField v-model="projectNameTextField"
                hint="Wpisz nazwę projektu" class="addProjectTextField" />

            <Label text="Opis projektu" textAlignment="center"
                class="addProjectHeader" />
            <TextField v-model="projectDescTextField"
                hint="Wpisz opis projektu" class="addProjectTextField" />

            <Label text="Priorytet projektu" textAlignment="center"
                class="addProjectHeader" />
            <ListPicker :items="listPickerPriority"
                v-model="selectedListPickerIndex" />

            <Button text="UTWÓRZ PROJEKT" @tap="onAddProjectConfirmButtonTap"
                class="addProjectConfirmButton" />

        </StackLayout>
    </ScrollView>
</template>

<script>
    export default {
        methods: {
            onAddProjectConfirmButtonTap() {
                console.log("Button was pressed");
            },
            onAddProjectImageButtonTap() {
                console.log("Add image button was pressed");
            }
        },

        data() {
            return {
                listPickerPriority: ["0", "1", "2", "3"],
                selectedListPickerIndex: 0,

                projectNameTextField: "",
                projectDescTextField: ""
            };
        }
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