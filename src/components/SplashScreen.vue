<template>
  <Page actionBarHidden="true" class="splashScreenBg" loading="loading">
    <ScrollView>
      <StackLayout class="splashScreen">
        <Label text="DeveloperDo" class="splashScreenTitle" />
        <ActivityIndicator
          busy="true"
          color="black"
          width="150"
          height="150"
          class="loadingSpinner"
        ></ActivityIndicator>
      </StackLayout>
    </ScrollView>
  </Page>
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
  width: 90%;
  height: 95%;
  border-radius: 40px;
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
  animation-duration: 5;
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
