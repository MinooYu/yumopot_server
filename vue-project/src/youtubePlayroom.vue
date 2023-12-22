<template>
	<div style="text-align: center; margin-top: 12px;">
		<div style=" margin-left: auto;margin-right: auto; margin-bottom: 32px;">
			<form @submit.prevent="addVideo();">
				<input type="text" placeholder="Youtube url" v-model="videoUrl" style="font-size: 16px; width: 1200px; padding: 8px 24px; border-radius: 4px; border: solid 1px #111;" />
			</form>
		</div>
	</div>
	<div style="margin-left: auto; margin-right: auto; width: 1720px; height: 780px;">
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
			<div style="width: 480px; height: 720px; background-color: #fff; margin-left: 32px;">
				<div style="width: 480px; margin: auto; margin-bottom: 12px; text-align: center; font-size: 24px; font-weight: 600; padding-top: 12px; display: flex;">
					<div class="modecolp" :style="modecolp" v-on:click="playlist = true" style="width: 180px; height: 48px; margin: auto; display: flex; border-radius: 12px; user-select: none;"><label style=" margin: auto; display: flex; justify-content: center; align-items: center; border-radius: 12px;">playlist</label></div>
					<div class="modecolc" :style="modecolc" v-on:click="playlist = false" style="width: 180px; height: 48px; margin: auto; display: flex; border-radius: 12px; user-select: none"><label style="margin: auto; display: flex; justify-content: center; align-items: center; border-radius: 12px;">chat</label></div>
				</div>
				<div style="width: 480px; background-color: #eee; height: 0.2px; margin-bottom: 24px;"></div>
				<div style="width: 480px; height: 540px; overflow-y: scroll;">
					<div v-for="(videoid, i) in videolist" :key="i" style="width: 420px; margin: auto; margin-bottom: 8px;">
						<div class="videolistitem" style="width: 420px; padding: 6px 8px; text-align: center; display: flex; background-color: #f4f4f4; border-radius: 6px;">
							<div :id="videoid.hash" style="width: 124px; height: 72px;"><img :src="videoid.URL" width="124" /></div>
							<div style="margin-left: 12px; width: 280px; padding: 12px 8px;">
								<div> hash : {{ videoid.hash }} </div>
								<div> vid : {{ videoid.vid }} </div>
							</div>
						</div>
					</div>
				</div>
				<div style="width: 480px; background-color: #eee; height: 0.2px; margin-bottom: 8px;"></div>
				<div v-if="playlist" style="width: 480px; height: 72px; margin: auto; " >
					<div style="width: 420px; margin: auto; display: flex;"> 
						<div style="width: 104px; height: 60px; margin: auto; display: flex;"><label class="nextbtn" style="width: 72px; height: 48px; margin: auto; display: flex; justify-content: center; align-items: center; border-radius: 12px;">shuffle</label></div>
						<div style="width: 104px; height: 60px; margin: auto; display: flex;"><label class="nextbtn" style="width: 72px; height: 48px; margin: auto; display: flex; justify-content: center; align-items: center; border-radius: 12px;">repeat</label></div>
						<div style="width: 104px; height: 60px; margin: auto; display: flex;"><label class="nextbtn" v-on:click="nextv" style="width: 72px; height: 48px; margin: auto; display: flex; justify-content: center; align-items: center; border-radius: 12px;">next</label></div>
					</div>
				</div>
				<div v-else style="width: 480px; height: 72px; margin: auto; " >
					<div style="width: 420px; margin: auto; display: flex;">
						<form @submit.prevent="sendposts(input)">
							<input  />
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- <div id="aaa" style="width: 480px; height: 520px;">

	</div> -->
</template>
  
<script>
import YouTube from 'vue3-youtube'

export default {
	components: {
		YouTube,
	},
	data() {
		return {
			roomid: '',
			name: '',
			mycolor: '',

			videoUrl: "",
			videolist: [],
			playindex: 0,
			nowstate: -1,
			playlist: true,
			input: '',
			// https://i.ytimg.com/vi/wr8hiRm671o/hq720.jpg
		};
	},
	watch: {
	},
	computed: {
		modecolp() {
			if(this.playlist) {
				return {
					'--rowcol' : "#eee",
					'--rowtxtcol' : "#2c3e50"
				}
			}
			return {
				'--rowcol' : "#00000000",
				'--rowtxtcol' : "#eee"
			}
			
		},
		modecolc() {
			if(!this.playlist) {
				return {
					'--rowcol' : "#eee",
					'--rowtxtcol' : "#2c3e50"
				}
			}
			return {
				'--rowcol' : "#00000000",
				'--rowtxtcol' : "#eee"
			}
			
		},
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

			var tmbnurl = "https://i.ytimg.com/vi/" + vid + "/hq720.jpg";
			var yidandthumbnail = {"hash": getRndStr(8),"flag": false ,"vid" : vid, "URL": tmbnurl};
			this.videolist.push(yidandthumbnail)

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

				// this.playindex++;
			}
		},
		onStateChange(event) {
			this.nowstate = event.data;
			
			if(event.data == 0) {
				this.playindex++;
				this.$refs.youtube.loadVideoById(this.videolist[this.playindex].vid);
			}
		},
		generateImgPath( hash, vid) {

			var imgElem = document.getElementById(hash);
			if(!imgElem) return

			const imgname = "https://i.ytimg.com/vi/" + vid + "/hq720.jpg";
			
			const img = new Image();
			// img.onload = () => resolve(img);
			img.src = imgname;
			img.width = 1080 / 10;
			img.width = 720 / 10;
			// console.log(img)
			imgElem.appendChild(img)
		},
		nextv() {
			if( this.playindex >= this.videolist.length) {
				return;
			}
			this.playindex++;
			console.log(this.playindex);
			console.log(this.videolist[this.playindex].vid);
			// this.$refs.youtube.loadVideoById(this.videolist[this.playindex].vid);
		},
		sendposts() {
			var userHash = this.$store.getters.getUserHash
			this.socket.emit("sendposts", this.roomid, this.name, userHash, this.input, this.mycolor);
			this.input = '';
		},
	}
};

function getRndStr(len){
	//使用文字の定義
	var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	
	//桁数の定義
	var len = len;
	
	//ランダムな文字列の生成
	var result = "";
	for(var i=0;i<len;i++){
		result += str.charAt(Math.floor(Math.random() * str.length));
	}
	return result;
}

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

.videolistitem:hover {
	background-color: #eee;
}

.nextbtn {
	background-color: #eee;
}

.nextbtn:hover {
	transition: 0.2s;
	transform: translateY(-1.2px);
	background-color: #ddd;
}

.rdiob {
	background-color: #eee;
}

.modecolp {
	background-color: var(--rowcol);
	color: var(--rowtxtcol);
}
.modecolc {
	background-color: var(--rowcol);
	color: var(--rowtxtcol);
}
</style>