<template>
    <ScrollView>
        <StackLayout class="addUsersModal">

            <Label text="Przydziel użytkowników do projektu"
                textAlignment="center" class="addUsersHeader"
                textWrap="true" />
            <SearchBar hint="Szukaj użytkowników" :text="searchUsers"
                @submit="onSearchSubmit" class="addUsersSearch" />
            <StackLayout v-for="user in users" class="usersSearchList"
                orientation="horizontal">
                <Image :src="user.imageSrc" stretch="aspectFill"
                    class="userPhoto" />
                <StackLayout verticalAlignment="center"
                    class="userTextContainer">
                    <Label :text="user.name" class="addUserName"
                        textWrap="true" />
                </StackLayout>
                <Switch checked="false" color="black" backgroundColor="green"
                    offBackgroundColor="gray" />
            </StackLayout>

            <Button text="DODAJ UŻYTKOWNIKÓW" @tap="onAddUsersButtonTap"
                class="addUsersButton" />

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
            onAddUsersButtonTap() {
                console.log("Users added!");
            }
        },

        data() {
            return {
                users: [{
                        imageSrc: "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                        name: "biggus dickus "
                    },
                    {
                        imageSrc: "https://www.pngitem.com/pimgs/m/622-6225086_dank-meme-laser-laughing-emoji-crying-emoji-riendo.png",
                        name: "biggus dickus "
                    }
                ]
            };
        }
    };
</script>

<style scoped>
    .addUsersModal {
        margin: 20px;
        vertical-align: center;
        background-color: white;
    }

    .addUsersHeader {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
    }

    .addUsersSearch {
        font-size: 14px;
        margin-bottom: 20px;
    }

    .usersSearchList {
        background-color: lightgray;
        border-radius: 20px;
        margin-bottom: 20px;
        android-elevation: 5;
    }

    .addUserName {
        font-size: 16px;
        font-weight: bold;
    }

    .addUsersButton {
        background-color: lightgray;
        color: black;
        font-size: 18px;
        font-weight: bold;
    }
</style>