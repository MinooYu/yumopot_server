<template>
	<div style="text-align: center; margin-top: 12px;">
		<div style=" margin-left: auto;margin-right: auto; margin-bottom: 24px;">
			<form @submit.prevent="addVideo();">
				<input type="text" placeholder="Youtube url" v-model="videoUrl" style="font-size: 16px; width: 1200px; padding: 8px 24px; border-radius: 4px; border: solid 1px #111;" />
			</form>
		</div>
	</div>
	<div style="margin-left: auto; margin-right: auto; width: 1720px; height: 720px;">
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
			<div style="width: 480px; height: 720px; background-color: #fff;">
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
							<input />
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- <div id="aaa" style="width: 480px; height: 520px;">

	</div> -->
	<!-- <div class="mlr-a" style="min-width: 880px; max-width: 1720px; height: 80px; filter: drop-shadow(0 0 6px #c6c6c6);"> -->
	<div class="mlr-a" style="min-width: 880px; max-width: 1720px; height: 80px;">
		<div class="mlr-a" style="min-width: 852px; max-width: 1720px; height: 2px; background-color: #fff; border-radius: 4px;">
			<input class="timeslider" type="range" name="speed" min="0" :max="alltime" v-model="currentTime" style=" height: 2px; width: 1720px; position: absolute;">
		</div>
		<div class="mlr-a" style="min-width: 852px; max-width: 1720px; height: 72px; background-color: #fff; border-radius: 0 0 4px 4px; display: flex;">
			<div style="display: flex; margin-left: 12px; width: 156px; margin-right: 12px;">
				<div style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'backward-step']" class="fa-xl" /></div>
				<div v-if="musicplaystate" v-on:click="musicplaystate = false" style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'play']" class="fa-2xl" /></div>
				<div v-else v-on:click="musicplaystate = true" style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'pause']" class="fa-2xl" /></div>
				<div style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'forward-step']" class="fa-xl" /></div>
			</div>
			<div style=" display: flex; align-items: center; width: 96px; margin-left: 12px; margin-right: 12px; user-select: none;">
				<label style="width: 40px; text-align: center;"> {{ currentTimemin }}:{{ currentTimesec }} </label>
				<label style="width: 12px; text-align: center;"> / </label>
				<label style="width: 40px; text-align: center;"> {{ alltimemin }}:{{ alltimesec }} </label>
			</div>
			<div style="min-width: 660px; max-width: 980px; margin: 4px; border-radius: 4px; display: flex; align-items: center; user-select: none; margin: auto;">
				<div class="mlr-a" style="display: flex; width: 316px;">
					<div style="width: 80px; display: flex; align-items: center; justify-content: center;">
						<label> thumbnail </label>
					</div>
					<div style="width: 152px; display: flex; align-items: center; justify-content: left; padding-left: 12px;">
						<div style="display: block;">
							<div><label>title</label></div>
							<div><label>artist</label></div>
						</div>
					</div>
					<div style="width: 80px; display: flex; align-items: center; justify-content: left; padding-left: 12px;">
						<label>option</label>
					</div>
				</div>
			</div>
			<div style=" display: flex; align-items: center; width: 96px; margin-left: 12px; margin-right: 12px;"></div>
			<div style="display: flex; margin-left: 12px; width: 156px; margin-right: 12px;">
				<div style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'repeat']" class="fa-xl" /></div>
				<div style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'shuffle']" class="fa-xl" /></div>
				<div style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'volume-xmark']" class="fa-xl" /></div>
			</div>
		</div>
	</div>
</template>
  
<script>
import YouTube from 'vue3-youtube'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTurkishLiraSign, fas } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

library.add(fas)

export default {
	components: {
		"axios": axios,
		YouTube,
		'font-awesome-icon': FontAwesomeIcon,
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
			musicplaystate: false,
			alltime: 0,
			alltimemin: "00",
			alltimesec: "00",

			currentTime: 0,
			currentTimemin: "00",
			currentTimesec: "00",
			intervalid: null,
			apikey: "AIzaSyB2lKJR9V5A2RAroWhj73LwWYOt4V7sHAo",
			url: "",
			// https://i.ytimg.com/vi/wr8hiRm671o/hq720.jpg
		};
	},
	watch: {
		currentTime() {
			// console.log(this.currentTime)
		},
		alltime() {

		}
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
		currenttimech() {
			if(this.$refs.youtube.getCurrentTime()) this.currentTime = this.$refs.youtube.getCurrentTime()
		},
		addVideo: async function() {
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
				this.alltime = this.$refs.youtube.getDuration()
				this.currentTime = this.$refs.youtube.getCurrentTime()
				// var youtubemoviedata = null;
				// var params =  {
				// 	q: "aaaa", // 検索クエリを指定します。
				// 	part: "snippet",
				// 	type: "video",
				// 	maxResults: "20",
				// 	key: "AIzaSyB2lKJR9V5A2RAroWhj73LwWYOt4V7sHAo"
				// }

				this.intervalid = setInterval(this.timecntinc, 300);

				// await axios.get("https://www.googleapis.com/youtube/v3/search", {params: params}).then(function(response) {youtubemoviedata = response.data.items}).catch(error => console.log(error));
				// console.log(youtubemoviedata);
				// this.playindex++;
			}
		},
		onStateChange(event) {
			this.nowstate = event.data;
			
			if(event.data == 0) {
				this.playindex++;
				this.$refs.youtube.loadVideoById(this.videolist[this.playindex].vid);
				this.alltime = this.$refs.youtube.getDuration()
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
		youtubedatagetter() {
			this.alltime = this.$refs.youtube.getDuration()
			this.alltime = Math.floor(this.alltime)
			console.log(this.$refs.youtube.getDuration())
			this.currentTime = this.$refs.youtube.getCurrentTime()
			this.currentTime = Math.floor(this.currentTime)
			console.log(this.$refs.youtube.getCurrentTime())
		},
		timecntinc() {
			if(this.nowstate != 1) return;

			this.alltime = this.$refs.youtube.getDuration()
			this.alltime = Math.floor(this.alltime)

			this.alltimemin = Math.floor(this.alltime/60).toString().padStart(2, "0")
			this.alltimesec = Math.floor(this.alltime%60).toString().padStart(2, "0")
			
			// console.log(this.$refs.youtube.getDuration())

			this.currentTime = this.$refs.youtube.getCurrentTime()
			this.currentTime = Math.floor(this.currentTime)

			this.currentTimemin = Math.floor(this.currentTime/60).toString().padStart(2, "0")
			this.currentTimesec = Math.floor(this.currentTime%60).toString().padStart(2, "0")
			// console.log(this.$refs.youtube.getCurrentTime())
		}
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

.timeslider {
}

.timeslider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	/* display: none; */
	/* color: #df2a2a !important; */
}

.timeslider::-webkit-slider-runnable-tracks {
	-webkit-appearance: none;
	appearance: none;
	height: 2px;
}
</style>