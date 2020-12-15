<template>
    <ScrollView>
        <StackLayout class="addTaskCategoryModal">

            <Label text="Nazwa kategorii zadań" textAlignment="center"
                class="addTaskCategoryHeader" textWrap="true" />
            <TextField v-model="taskNameTextField" hint="Wpisz nazwę kategorii zadań"
                class="addTaskCategoryTextField" />

            <Button text="DODAJ KATEGORIĘ ZADAŃ" @tap="onAddTaskCategoryButtonTap" class="addTaskCategoryConfirmButton" textWrap="true"/>

        </StackLayout>
    </ScrollView>
</template>

<script>
    export default {
methods: {
    onAddTaskCategoryButtonTap() {
    console.log("Task category has been added");
  },
},

        data() {
            return {};
        }
    };
</script>

<style scoped>
    .addTaskCategoryModal {
        margin: 20px;
        vertical-align: center;
        background-color: white;
    }

    .addTaskCategoryHeader {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
    }

    .addTaskCategoryTextField {
        font-size: 16px;
        margin-bottom: 50px;
    }

    .addTaskCategoryConfirmButton {
        background-color: lightgray;
        color: black;
        font-size: 18px;
        font-weight: bold;
        padding: 20px;
    }
</style>