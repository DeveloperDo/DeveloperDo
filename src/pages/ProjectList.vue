<template>
    <Page>
      <ActionBar>
        <GridLayout width="100%" columns="auto, *">
          <Label text="MENU" @tap="openDrawer()" col="0"/>
          <Label class="title" text="Welcome to NativeScript-Vue!"  col="1"/>
        </GridLayout>
      </ActionBar>

        <FlexboxLayout flexDirection="column">

            <ScrollView>
                <StackLayout className="projectList">
                    <StackLayout v-for="project in projects"
                        class="projectCard"
                        v-bind:class="{ lowPriority: project.priority == '1', mediumPriority: project.priority == '2', highPriority: project.priority == '3' }"
                        @tap="onItemTap">
                        <Label :text="project.status" class="projectStatus"
                            textTransform="uppercase" />
                        <Image :src="project.imageSrc" class="projectImg"
                            stretch="aspectFill" />
                        <Label :text="project.name" class="projectName"
                            textWrap="true" />
                        <Label :text="project.deadline"
                            class="projectDeadline" />
                    </StackLayout>
                </StackLayout>
            </ScrollView>

            <Button text="DODAJ PROJEKT" @tap="onButtonTap"
                class="addProjectButton" />

        </FlexboxLayout>

    </Page>
</template>

<script>
	import sideDrawer from "../mixins/sideDrawer";
	export default {
		mixins: [sideDrawer],
		methods: {
			onButtonTap() {
				//funkcja: dodaj nowy projekt
			},
			onItemTap() {
				//funkcja: przenieś do widoku projektu
			}
		},
		data() {
			return {
				//tu sobie wstawisz pewnie bazę danych z Firebase
				projects: [{
						status: "do zrobienia",
						name: "lorem ipsum dolor nie pamietam co dalej i mam to w nosie",
						imageSrc: "https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2020-2560x1440-1455.jpg",
						deadline: "12-01-2010",
						priority: "0"
					},
					{
						status: "w trakcie",
						name: "hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
						imageSrc: "https://www.emojirequest.com/images/PointingLaughingEmoji.jpg",
						deadline: "brak terminu",
						priority: "1"
					},
					{
						status: "zrobione",
						name: "1234567890",
						imageSrc: "https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/1ecfc7c3-8b2b-43d8-94f7-947c1bdb4a95/933870758/masa-cool-wallpapers-wallpaper-hd-background-screenshot.jpg",
						deadline: "brak terminu",
						priority: "2"
					},
					{
						status: "wstrzymane",
						name: "ok",
						imageSrc: "https://steamuserimages-a.akamaihd.net/ugc/98349353829091841/AA2C1F9CD9F438CAEEA3882398054BCBA441DE24/",
						deadline: "18-10-2011",
						priority: "3"
					},
					{
						status: "wdrożone",
						name: "QWERTYUIOP",
						imageSrc: "https://image.winudf.com/v2/image/Y29tLnNuZG53YWxscGFwZXJzLmJsYWNrd2FsbHBhcGVyc19zY3JlZW5fMl8xNTI5Mzc4ODMzXzA4OQ/screen-2.jpg?fakeurl=1&type=.jpg",
						deadline: "brak terminu",
						priority: "2"
					}
				]
			};
		},
	};
</script>

<style scoped lang="scss">
    .projectList {
        background-color: white;
    }

    .projectCard {
        margin-top: 20px;
        margin-bottom: 20px;
        width: 90%;
        horizontal-align: center;
        border-radius: 40px;
        background-color: lightgray;

        android-elevation: 10;
    }

    .lowPriority {
        background-color: lightgreen;
    }

    .mediumPriority {
        background-color: khaki;
    }

    .highPriority {
        background-color: lightcoral;
    }

    .projectStatus {
        margin-top: 20px;
        font-size: 18px;
        text-align: center;
        font-weight: bold;
    }

    .projectImg {
        margin-top: 20px;
        margin-bottom: 20px;
        height: 250px;
        width: 400px;
        border-radius: 100px;
        android-elevation: 5;
    }

    .projectName {
        margin-left: 50px;
        margin-right: 50px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
    }

    .projectDeadline {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 18px;
        text-align: center;
    }

    .addProjectButton {
        background-color: lightgray;
        color: black;
        font-size: 18px;
        font-weight: bold;
        height: 20%;
    }
</style>