<template>
  <StackLayout class="splashScreen">
    <ActivityIndicator
      busy="true"
      color="black"
      width="150"
      height="150"
      class="loadingSpinner"
    ></ActivityIndicator>
  </StackLayout>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
.splashScreen {
  width: 100%;
  height: 100%;
  vertical-align: center;
  horizontal-align: center;
  background-color: white;

  android-elevation: 10;
}

.loadingSpinner {
  animation-name: opacity;
  animation-duration: 5;
  vertical-align: center;
  horizontal-align: center;
}

@keyframes opacity {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
