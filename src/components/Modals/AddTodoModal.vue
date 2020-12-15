<template>
    <ScrollView>
        <StackLayout class="addTaskModal">

            <Label text="Nazwa zadania" textAlignment="center"
                class="addTaskHeader" />
            <TextField v-model="taskNameTextField" hint="Wpisz nazwę zadania"
                class="addTaskTextField" />

            <Label text="Przydziel członków projektu do zadania"
                textAlignment="center" class="addTaskHeader"
                textWrap="true" />
            <SearchBar hint="Szukaj członków projektu" :text="searchUsers"
                @submit="onSearchSubmit" class="addTaskSearchUsers"/>
            <StackLayout v-for="user in project.users"
                class="projectUsersList" orientation="horizontal">
                <Image :src="user.imageSrc" stretch="aspectFill"
                    class="userPhoto" />
                <StackLayout verticalAlignment="center"
                    class="userTextContainer">
                    <Label :text="user.name" class="addUserTaskName"
                        textWrap="true" />
                    <Label :text="user.role" class="addUserTaskRole"
                        textWrap="true" />
                </StackLayout>
                <Switch checked="false" color="black" backgroundColor="green"
                    offBackgroundColor="gray" />
            </StackLayout>

            <Button text="DODAJ ZADANIE" @tap="onAddTaskConfirmButtonTap"
                class="addTaskConfirmButton" />

        </StackLayout>
    </ScrollView>
</template>

<script>
    export default {
        methods: {
            onSearchSubmit(args) {
                let searchBar = args.object;
                console.log("You are searching for " + searchBar.text);
            },

            onAddTaskConfirmButtonTap() {
                console.log("Task added!");
            }
        },

        data() {
            return {
                searchPhrase: "",

                project: {
                    users: [{
                            imageSrc: "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                            name: "biggus dickus",
                            role: "programista backend"
                        },
                        {
                            imageSrc: "https://www.pinclipart.com/picdir/middle/324-3242324_free-png-download-open-eye-crying-laughing-emoji.png",
                            name: "mike hunt",
                            role: "programista frontend"
                        },
                        {
                            imageSrc: "https://ih1.redbubble.net/image.984211807.4879/ur,mounted_print_canvas_portrait_small_front,square,1000x1000.1.jpg",
                            name: "Lorem Ipsum",
                            role: "tester"
                        },
                        {
                            imageSrc: "https://media.tenor.com/images/db6a2db8639a596cd5b96ec9c7d0087b/tenor.png",
                            name: "Cyberbug 2077",
                            role: "PR manager"
                        },
                        {
                            imageSrc: "https://media.tenor.com/images/db6a2db8639a596cd5b96ec9c7d0087b/tenor.png",
                            name: "p",
                            role: "t"
                        },
                        {
                            imageSrc: "https://ih1.redbubble.net/image.984211807.4879/ur,mounted_print_canvas_portrait_small_front,square,1000x1000.1.jpg",
                            name: "Lorem ipsum dolor sit amet dfgjdfg dflkg sdlkf",
                            role: "123 hife ds kdsng kdfs sd"
                        }
                    ]
                },

                taskNameTextField: ""
            };
        }
    };
</script>

<style scoped>
    .addTaskModal {
        margin: 20px;
        vertical-align: center;
        background-color: white;
    }

    .addTaskHeader {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
    }

    .addTaskTextField {
        font-size: 16px;
        margin-bottom: 50px;
    }

    .projectUsersList {
        background-color: lightgray;
        border-radius: 20px;
        margin-bottom: 20px;
        android-elevation: 5;
    }

    .userTextContainer {
        width: 40%;
        margin-right: 20px;
    }

    .addUserTaskName {
        font-size: 16px;
        font-weight: bold;
    }

    .addUserTaskRole {
        font-size: 12px;
        font-style: italic;
    }

    .addTaskConfirmButton {
        background-color: lightgray;
        color: black;
        font-size: 18px;
        font-weight: bold;
    }

    .addTaskSearchUsers {
        font-size: 14px;
        margin-bottom: 20px;
    }
</style>