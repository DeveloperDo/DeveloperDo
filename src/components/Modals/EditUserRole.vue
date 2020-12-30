<template>
  <ScrollView height="100%">
    <StackLayout class="editUserRoleModal">

      <Label
          text="Przydziel rolę"
          textAlignment="center"
          class="editRoleHeader" />

      <TextField
          v-model="role"
          hint="Wpisz rolę użytkownika"
          class="userRoleTextField"
      />

      <Button
          text="PRZYDZIEL ROLĘ"
          @tap="confirm"
          class="userRoleConfirmButton"
      />

    </StackLayout>
  </ScrollView>
</template>

<script>
export default {
  name: "EditUserRole"
}
</script>

<style scoped>

.editUserRoleModal {
  margin: 20px;
  vertical-align: center;
  background-color: white;
}

.editRoleHeader {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.userRoleTextField {
  font-size: 16px;
  margin-bottom: 50px;
}

.userRoleConfirmButton {
  background-color: lightgray;
  color: black;
  font-size: 18px;
  font-weight: bold;
}

</style>