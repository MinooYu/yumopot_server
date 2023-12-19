<template>
	<div style="text-align: center; margin-top: 12px;">
		<div style=" margin-left: auto;margin-right: auto; margin-bottom: 32px;">
			<form @submit.prevent="addVideo()">
				<input type="text" placeholder="Youtube url" v-model="videoUrl" style="font-size: 16px; width: 1200px; padding: 8px 24px; border-radius: 4px; border: solid 1px #111;" />
			</form>
		</div>
	</div>
	<div style="margin-left: auto; margin-right: auto; width: 1720px;">
		<div style="display: flex;">
			<div style="width: 1240px;">
				<YouTube 
					src=""
					width="1240"
					height="720"
					@ready="onReady"
					@state-change="onStateChange"
					ref="youtube"
				/>
			</div>
			<div style="width: 480px; background-color: #fff; margin-left: 32px;">
				<div style="width: 480px; margin: auto; margin-bottom: 12px; text-align: center; font-size: 24px; font-weight: 600; padding-top: 12px;">playlist</div>
				<div style="width: 480px; background-color: #eee; height: 0.2px; margin-bottom: 12px;"></div>
				<div v-for="(videoid, i) in videolist" :key="i" style="width: 420px; margin: auto; margin-bottom: 12px; text-align: center;"> {{ videoid }}</div>
			</div>
		</div>
	</div>
</template>
  
<script>
import YouTube from 'vue3-youtube'

export default {
	components: {
		YouTube,
	},
	data() {
		return {
			videoUrl: "",
			videolist: [],
			playindex: 0,
			nowstate: -1,
		};
	},
	watch: {
	},
	methods: {
		logErrors (promise) {
			promise.catch(console.error)
		},

		onDragOver (isDraggingOver) {
			this.dragover = isDraggingOver
		},
		onReady() {
			this.$refs.youtube.playvideo();
		},
		addVideo() {
			var vid = "";
			var eqindex = this.videoUrl.indexOf("=");
			console.log(eqindex)
			vid = this.videoUrl.slice(eqindex + 1);
			console.log(vid)
			this.videolist.push(vid)

			this.videoUrl = "";

			if(this.nowstate == -1) {
				this.$refs.youtube.loadVideoById(vid);
				console.log(this.$refs.youtube)

				// setInterval(
				// 	function (youtube) {
				// 		if(youtube.getPlayerState() == 0) console.log("fin")
				// 	}, 
				// 	300,
				// 	this.$refs.youtube
				// )

				this.playindex++;
			}
		},
		onStateChange(event) {
			// console.log("event")
			// console.log	(event)
			this.nowstate = event.data;
			
			if(event.data == 0) {
				this.$refs.youtube.loadVideoById(this.videolist[this.playindex]);
				this.playindex++;
			}
		}
	}
};

</script>

<style scoped>
.mlr-a {
	margin-left: auto; margin-right: auto;
}

.drop-area {
  height: 300px;
  color: #fff;
  text-align: center;
  font-weight: bold;
  padding: 10px;

  background-color: rgba(0,0,0,.5);
}

.dragover {
  background-color: rgba(0,0,0,.8);
}

.drop-error {
  color: red;
  font-weight: bold;
}

.decodetext ::after {
	background-color: rgb(255, 0, 0);
	height: 12px;
}
</style>