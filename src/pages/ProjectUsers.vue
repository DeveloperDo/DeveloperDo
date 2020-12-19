<template>
  <Page>
    <ActionBar title="Widok zespołu" />

    <FlexboxLayout flexDirection="column">
      <ScrollView>
        <StackLayout>
          <StackLayout class="userCard" v-for="user in project.users">
            <StackLayout orientation="horizontal">
              <Image
                :src="user.imageSrc"
                stretch="aspectFill"
                class="userPhoto"
              />
              <StackLayout verticalAlignment="center">
                <Label :text="user.name" class="userName" textWrap="true" />
                <Label :text="user.role" class="userRole" textWrap="true" />
              </StackLayout>
            </StackLayout>
            <Button
              text="USUŃ Z ZESPOŁU"
              @tap="deleteUser"
              class="deleteUserButton"
              horizontalAlignment="center"
            />
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <Button
        text="DODAJ UŻYTKOWNIKA"
        @tap="onAddUserButtonTap"
        class="addUserButton"
      />
    </FlexboxLayout>
  </Page>
</template>

<script>
export default {
  methods: {
    deleteUser() {
      console.log("User has been deleted!");
    },

    onAddUserButtonTap() {
      console.log("Add user button was pressed");
    },
  },

  data() {
    return {
      project: {
        users: [
          {
            imageSrc:
              "https://www.wykop.pl/cdn/c3201142/comment_Z7p1VEFHWffsDomKfUAVQ6KbZNO9tJK5.jpg",
            name: "Lenny",
            role: "Project Manager",
          },
          {
            imageSrc:
              "https://www.wykop.pl/cdn/c3397993/link_1602581214Hwhy5rHd3dvxGK8t6m5Yb0,w300h223.jpg",
            name: "Ojciec Vateusz",
            role: "Scrum Master",
          },
          {
            imageSrc:
              "https://www.wykop.pl/cdn/c3397993/link_1602581214Hwhy5rHd3dvxGK8t6m5Yb0,w300h223.jpg",
            name: "Lorem Ipsum Ręce Z Gipsu",
            role: "Tester test test test test test test test",
          },
          {
            imageSrc:
              "https://paczaizm.pl/content/wp-content/uploads/kaczynski-dostaliscie-po-500-to-morda-w-kubel.jpg",
            name: "sgdfk dfshgjkl d dfhsgd gjkd sihg sdf jsjk ",
            role: "dg sd4350 r0hjf fgk fdkld dkgf ioj hertpj km ldf",
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
.userCard {
  margin-top: 25px;
  margin-bottom: 25px;
  background-color: lightgray;
  width: 90%;
  border-radius: 50px;
  android-elevation: 10;
}

.userPhoto {
  width: 200px;
  height: 200px;
  margin: 20px;
  border-radius: 100px;
  android-elevation: 10;
}

.userName {
  padding: 10px;
  font-size: 28px;
  font-weight: bold;
}

.userRole {
  padding: 10px;
  font-size: 14px;
  font-style: italic;
}

.addUserButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
  height: 20%;
}

.deleteUserButton {
  background-color: lightcoral;
  color: white;
  font-size: 14px;
  font-weight: bold;
  width: 60%;
  height: 100px;
}
</style>
