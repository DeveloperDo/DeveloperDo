<template>
    <ScrollView>
        <StackLayout class="editProjectModal">
            <Label text="Logo projektu" textAlignment="center"
                class="editProjectHeader" />
            <Image
                src="https://altimadental.pl/wp-content/uploads/2015/01/default-placeholder.png"
                stretch="aspectFill" class="editProjectPhoto"
                @tap="onEditProjectImageButtonTap" />

            <Label text="Nazwa projektu" textAlignment="center"
                class="editProjectHeader" />
            <TextField v-model="name" hint="Wpisz nazwę projektu"
                class="editProjectTextField" />

            <Label text="Opis projektu" textAlignment="center"
                class="editProjectHeader" />
            <TextField v-model="desc" hint="Wpisz opis projektu"
                class="editProjectTextField" />

            <Label text="Status projektu" textAlignment="center"
                class="editProjectHeader" />
            <ListPicker :items="listPickerStatus" v-model="status" />

            <Label text="Priorytet projektu" textAlignment="center"
                class="editProjectHeader" />
            <ListPicker :items="listPickerPriority" v-model="priority" />

            <Button text="AKTUALIZUJ PROJEKT" @tap="editProject"
                class="editProjectConfirmButton" />

            <Button text="USUŃ PROJEKT" @tap="editProject"
                class="deleteProjectButton" />

            <Button text="ANULUJ" class="editProjectConfirmButton" />
        </StackLayout>
    </ScrollView>
</template>

<script>
    export default {
        data() {
            return {
                listPickerStatus: [
                    "do zrobienia",
                    "w trakcie",
                    "wstrzymane",
                    "zrobione",
                    "wdrożone"
                ],
                status: 0,
                listPickerPriority: ["brak", "niski", "średni", "wysoki"],
                priority: 0,
                name: "SUPER COOL PROJECT!!!!!!",
                desc: "Lorem ipsum dolor sit cośtam"
            };
        },

        methods: {
            onEditProjectImageButtonTap() {
                console.log("edit image button was pressed");
            }
        }
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