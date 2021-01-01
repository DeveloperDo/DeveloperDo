<template>
  <StackLayout class="splashScreen">
    <Image src="res://logo" gravity="center" />
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
.splashScreenBg {
  width: 100%;
  height: 100%;
  background-color: lightgray;
}

.splashScreen {
  width: 100%;
  height: 100%;
  vertical-align: center;
  horizontal-align: center;
  background-color: white;

  android-elevation: 10;
}

.splashScreenTitle {
  font-family: monospace;
  font-weight: bold;
  font-size: 30px;
  vertical-align: center;
  horizontal-align: center;
  margin-bottom: 150px;
}

.loadingSpinner {
  animation-name: opacity;
  animation-duration: 1s;
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
