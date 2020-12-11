<template>
    <Page>
        <ActionBar title="DeveloperDo" />
        <ScrollView>
            <StackLayout class="register-panel">
                <!--Add your page content here-->
                <Label text="" />
                <label text="Nazwa użytkownika"
                    style="horizontal-align: center; font-size: 20px;">
                </label>
                <TextField v-model="userName" hint="" class="inputTextSize" />

                <Label text="" />
                <label text="Hasło"
                    style="horizontal-align: center;  font-size: 20px;">
                </label>
                <TextField v-model="userPassword" hint=""
                    class="inputTextSize" />

                <Label text="" />
                <label text="Adres e-mail"
                    style="horizontal-align: center; font-size: 20px;">
                </label>
                <TextField v-model="userEmail" hint=""
                    class="inputTextSize" />
                    
                <Label text="" />
                <Button text="Zarejestruj" @tap="onButtonTap" />
                <Label text="" />
                <Button text="Powrót" @tap="onButtonTap" />
            </StackLayout>
        </ScrollView>
    </Page>
</template>
<script>
    export default {
        methods: {
            onButtonTap() {
                console.log("Button was pressed");
            }
        },

        data() {
            return {};
        }
    };
</script>

<style scoped>
    .home-panel {
        vertical-align: center;
        font-size: 20;
        margin: 15;
    }

    .inputTextSize {
        font-size: 18px;
    }

    .description-label {
        margin-bottom: 15;
    }
</style>