<template>
	<!-- <div style="margin-left: auto; margin-right: auto;"><button :v-on:click="sendposts(sendmes)">send posts</button></div> -->
	<div class="mlr-a" style="min-width: 880px; max-width: 1260px; display: flex; flex-wrap: wrap; padding-top: 24px;">
		<div class="mlr-a" style="width: 880px; height: 640px; background-color: #fff; border-radius: 4px; filter: drop-shadow(0 0 6px #c6c6c6); margin-top: 12px;">
			<App v-if="roomkind == 1" :roomid="$route.params.id" :socket="socket"></App>
		</div>
		<div class="mlr-a" style="width: 320px; height: 640px; margin-top: 12px;">
			<div style="height: 64px; width: 320px; margin-bottom: 16px; background-color: #fff; border-radius: 4px; filter: drop-shadow(0 0 6px #c6c6c6); display: flex; user-select: none;">
				<div v-on:click="playlistview = true" style="height: 64px; width: 156px; margin-right: 12px; display: flex; justify-content: center; align-items: center;">
					<label class="modecolp" :style="modecolp">playlist</label>
				</div>
				<div style="width: 0.2px; background-color: #eee; margin-top: 4px; margin-bottom: 4px;"></div>
				<div v-on:click="playlistview = false" style="height: 64px; width: 156px; display: flex; justify-content: center; align-items: center;">
					<label class="modecolc" :style="modecolc">chat</label>
				</div>
			</div>
			<div style="height: 560px; background-color: #fff; border-radius: 4px; filter: drop-shadow(0 0 6px #c6c6c6); padding-top: 12px;">
				<div class="mlr-a" style="width: 320px;">
					<div style=" width: 280px; margin-left: auto; margin-right: auto;">
						<div>
							<form @submit.prevent="namech(name)">
								<input type="text" v-model="name" class="border-2 border-gray-400 rounded" placeholder="名前を変更" style="width: 100%; text-align: center; padding: 2px 4px; height: 24px; border-radius: 4px; border: 0.4px solid #777;"/>
							</form>
							<input type="color" v-model="mycolor" style="width: 280px; margin-top: 4px;" />
						</div>
						<div style="margin-top: 6px;">
							<form @submit.prevent="sendposts(input)">
								<input type="text" v-model="input" class="border-2 border-gray-400 rounded" placeholder="メッセージを送信" style="width: 100%; text-align: left; padding: 2px 4px; height: 32px; margin-top: 4px; border-radius: 4px; border: 0.4px solid #777;"/>
							</form>
						</div>
						<!-- <input type="button" value="送信" @click="sendposts(input)" /> -->
					</div>
				</div>

				<!-- <div class="mlr-a" style="width: 1200px; display: flex;">
					<div style="margin-left: auto; margin-right: auto;"><button v-on:click="viewposts">view posts</button></div>
				</div> -->
				<div><a style="color: red;">{{ message }}</a></div>


				<div class="mlr-a" id="scroller" style="width: 312px; height: 252px; margin-top: 8px; overflow-y: scroll; overflow-x: hidden;">
					<div v-for="(post, i) in posts" :key="i" class="fadeLeft" style="width: 280px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: left; margin-top: 4px;"><a class="name">{{ post.name }} : </a><a>{{ post.post }}</a></div>
				</div>
				<div class="mlr-a" style="width: 312px; margin-top: 8px;">
					<div style="width: 152px; margin-bottom: 8px; padding: 4px 12px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: center; background-color: #eee; margin-top: 12px;"> users:{{ users.length }}</div>
				</div>
				<div class="mlr-a" style="width: 312px; height: 124px; margin-top: 8px; margin-bottom: 8px; overflow-y: scroll; overflow-x: hidden;">
					<div class="fadeLeft" v-for="(user, j) in users" :key="j" style="width: 280px; padding: 4px 12px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: center; background-color: #eee; margin-top: 4px;"><a>{{ user.name }}</a></div>
					<!-- <div style="width: 280px; padding: 4px 12px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: center; background-color: #eee; margin-top: 12px;"><a>{{ users }}</a></div> -->
				</div>
			</div>
		</div>
	</div>
	<div class="mlr-a" style="min-width: 880px; max-width: 1260px; height: 80px; margin-top: 16px; filter: drop-shadow(0 0 6px #c6c6c6);">
		<div class="mlr-a" style="min-width: 852px; max-width: 1232px; height: 2px; background-color: #fff; border-radius: 4px;"><input class="timeslider" type="range" name="speed" min="0" :max="mlen" value="0" v-model="linewid" style=" height: 2px; width: 1232px; position: absolute;"></div>
		<div class="mlr-a" style="min-width: 852px; max-width: 1232px; height: 72px; background-color: #fff; border-radius: 0 0 4px 4px; display: flex;">
			<div style="display: flex; margin-left: 12px; width: 156px; margin-right: 12px;">
				<div style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'backward-step']" class="fa-xl" /></div>
				<div v-if="musicplaystate" v-on:click="musicplaystate = false" style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'play']" class="fa-2xl" /></div>
				<div v-else v-on:click="musicplaystate = true" style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'pause']" class="fa-2xl" /></div>
				<div style="width: 52px; display: flex; text-align: center; align-items: center; justify-content: center;"><font-awesome-icon :icon="['fas', 'forward-step']" class="fa-xl" /></div>
			</div>
			<div style=" display: flex; align-items: center; width: 96px; margin-left: 12px; margin-right: 12px; user-select: none;">
				<label style="width: 40px; text-align: center;"> 00:00 </label>
				<label style="width: 12px; text-align: center;"> / </label>
				<label style="width: 40px; text-align: center;"> 00:00 </label>
			</div>
			<div style="min-width: 660px; max-width: 980px; margin: 4px; border-radius: 4px; display: flex; align-items: center;">
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

	<div v-if="!notimodalflag" style="position: fixed; user-select: none; bottom: 24px; right: calc((100vw - 96vw) / 2); height: 52px; width: 52px; background-color: #fff; border-radius: 50%; text-align: center; display: flex; align-items: center; text-align: center; filter: drop-shadow(0 0 6px #c6c6c6);" v-on:click="notimodalflag = !notimodalflag;"><label style="width: 52px;">{{ notifydatalen }}</label></div>
	<div v-else-if="notimodalflag" style="position: fixed; user-select: none; bottom: 24px; right: calc((100vw - 96vw) / 2); height: 52px; width: 52px; background-color: #fff; border-radius: 50%; text-align: center; display: flex; align-items: center; text-align: center; filter: drop-shadow(0 0 6px #c6c6c6);" v-on:click="notimodalflag = !notimodalflag; notifydatach()"><label style="width: 52px;">X</label></div>

	<div class="mlr-a" v-if="notimodalflag && notifydatalen == 0" style="width: 280px; position: fixed; bottom: 88px; right: calc((100vw - 96vw) / 2); margin-top: 12px; padding-top: 4px; padding-bottom: 4px;">
		<div class="mlr-a" style="width: 280px; height: 124px; margin-top: 8px; background-color: #fff; border-radius: 4px; padding-top: 2px; padding-bottom: 2px; filter: drop-shadow(0 0 6px #c6c6c6); text-align: center; display: flex; align-items: center;"><label style="width: 280px; font-size: 24px;">Oops...</label></div>
	</div>
	<div class="mlr-a" v-else-if="notimodalflag && notifydatalen != 0" style="width: 280px; position: fixed; bottom: 88px; right: calc((100vw - 96vw) / 2); margin-top: 12px; padding-top: 4px; padding-bottom: 4px;">
		<div class="mlr-a" style="width: 280px; min-height: 384px; max-height: 384px; margin-top: 8px; background-color: #fff; border-radius: 4px; padding-top: 2px; padding-bottom: 2px; filter: drop-shadow(0 0 6px #c6c6c6);">
			<div class="mlr-a" style="width: 272px; min-height: 364px; max-height: 364px; margin-top: 8px; margin-bottom: 8px; overflow-y: scroll; overflow-x: hidden; background-color: #fff; border-radius: 4px; padding: 0 4px;">
				<div class="mlr-a fadeLeft notifyitems" v-for="(data, l) in notifydata" :key="l" v-on:click="data.flag = true" v-bind:class="{ 'notifyitems-anim': data.flag }" style="display: flex; user-select: none;"><a style="background-color: #eee; border-radius: 4px; width: 258px; padding: 4px 12px; margin-top: 4px;">{{ data.data }}</a></div>
			</div>
		</div>
	</div>
</template>

<script>

let targets = document.querySelectorAll('.notify-cell-anim'); //ターゲット要素
//スクロールイベント
window.addEventListener('scroll', function () {
	var scroll = window.scrollY; //スクロール量を取得
	var windowHeight = window.innerHeight; //画面の高さを取得
	for (let target of targets) { //ターゲット要素がある分、アニメーション用のクラスをつける処理を繰り返す
		var targetPos = target.getBoundingClientRect().top + scroll; //ターゲット要素の位置を取得
		if (scroll > targetPos - windowHeight) { //スクロール量 > ターゲット要素の位置
			target.classList.add('fadeLeft'); //is-animatedクラスを加える
		}
	}
});

import io from "socket.io-client";
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

export default {
	name: 'Room',
	el: "#home",
	components: {
		'App': App,
		'font-awesome-icon': FontAwesomeIcon,
	},
	data: () => (
		{
			roomid: '',
			socket: io("http://localhost:3031"),
			posts: [],
			message: '',
			input: '',
			name: '',
			users: [],
			mycolor: '#000000',
			notifydata: [],
			notifydatalen: 0,
			notimodalflag: false,
			roomname: '',
			roomkind: 1,
			password: '',
			mlen: 3600,

			musicplaystate: false,
			playlistview: false,
		}
	),
	watch: {
		posts(newval, oldval) {
			this.$nextTick(() => {
				let elements = document.getElementsByClassName('name');

				for(var i = 0; i<elements.length; i++)
				{
					elements[i].style.color = this.posts[i].color;
				}
				const scroller =  document.getElementById('scroller');
				scroller.scrollTo(0, scroller.scrollHeight - scroller.clientHeight);
			})
		},
		notifydata() {

		}
	},
	created() {
		var name = getRndStr();
		console.log(name)
		this.name = name;
		
		console.log("--------id")
		console.log(this.$route.params.id)
		this.roomid = this.$route.params.id
		console.log("--------name")
		console.log(this.$route.params.name)
		this.roomname = this.$route.params.name
		this.password = this.$route.params.password
		// this.roomkind = this.$route.params.roomkind
		this.joinroom(name)
		// this.socket.emit("sendposts", this.roomid, "始めました");
		
	},
	computed: {
		modecolp() {
			if(this.playlistview) {
				return {
					'--rowtxtcol' : "#2c3e50",
					'--rowfontweight' : 400,
				}
			}
			return {
				'--rowtxtcol' : "#c6c6c6",
				'--rowfontweight' : 100,
			}
			
		},
		modecolc() {
			if(!this.playlistview) {
				return {
					'--rowtxtcol' : "#2c3e50",
					'--rowfontweight' : 400,
				}
			}
			return {
				'--rowtxtcol' : "#c6c6c6",
				'--rowfontweight' : 100,
			}
			
		},
	},
	mounted() {
		this.socket.on("hello", (str, cnt) => {
			console.log(str);
			this.connectcnt = cnt;
		});
		this.socket.on("roomview", (rooms) => {
			this.rooms = rooms;
		});
		this.socket.on("viewpost", (post) => {
			var tempposts = [];
			
			// 更新検知,pushを感知してくれないことがわかったので諦め
			// 仮の配列をよういしてそこに同じ値を打ち込んで最終的にpostsを置き換える方針に変更

			// Vue.setで行けるらしいのだが、Vueをしらないと言われる
			// import Vue from vue をしても vueを知らないと言われるのでもうだめ
			this.posts.forEach(element => {
				tempposts.push(element)
			});
			tempposts.push(post);

			this.posts = tempposts;
		});
		this.socket.on("viewposts", (posts) => {
			console.log(posts)
			this.posts = posts;
		});
		this.socket.on("roominuser", (users) => {
			this.users = users;
		});
		this.socket.on("err", (message) => {
			this.message = message;
		});

		this.socket.on("notify", (data) => {
			this.notifydatalen = 0;
			this.notifydata.push(data)
			this.notifydata.forEach(element => {
				if(!element.readflag) this.notifydatalen ++;
			});
		});

		this.socket.emit("viewposts", this.roomid);
		this.socket.emit("roominuser", this.roomid);
	},
	methods: {
		roomview() {
			this.socket.emit("roomview");
		},
		sendposts() {
			var userHash = this.$store.getters.getUserHash
			this.socket.emit("sendposts", this.roomid, this.name, userHash, this.input, this.mycolor);
			this.input = '';
		},
		joinroom(name) {
			console.log(this.roomname)
			// roomkind : 1 = drawchat, 2 = playroom
			this.socket.emit("roomcreate", this.roomid, this.roomname, this.password);
			this.socket.emit("joinroom", this.roomid, name);
		},
		roomview() {
			this.socket.emit("roomview");
		},
		namech() {
			const userIndex = this.users.findIndex((u) => u.id == this.socket.id);
			if(userIndex == -1) this.message = "見つかりません"
			if(this.users[userIndex].name == this.name) return

			this.socket.emit("namech", this.roomid, this.name);
		},
		notifydatach() {
			// var i = 0;
			console.log("datach")
			for(var i = 0; i<this.notifydata.length; i++) {
				if(this.notifydata[i].flag == true) {
					this.notifydata.splice(i, 1);
					i--;
				}
			}

			this.notifydatalen = this.notifydata.length
		}
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function uuid_gen () {
	let uuid = crypto.randomUUID();
	return uuid;
}

function getRndStr(){
	//使用文字の定義
	var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	
	//桁数の定義
	var len = 8;
	
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

.minescell {
	width: 64px;
	height: 64px;
}

.rowlength {
	width: calc(1px * var(--rowlen));
}
.back-e {
	background-color: #eee;
}
.back-r {
	background-color: #df2a2a;
}

::-webkit-scrollbar{
   width: 6px;
}
/* ::-webkit-scrollbar-track{
   background-color: #fff;
} */
::-webkit-scrollbar-thumb{
	border-radius: 3px;
	background-color: #c5c5c7;
}

.fadeLeft{
	animation-name:fadeLeftAnime;
	animation-duration:0.4s;
	animation-fill-mode:forwards;
	opacity:0;
}

@keyframes fadeLeftAnime{
	from {
		opacity: 0;
		transform: translateX(24px);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.notifyitems-anim {
	animation-name:fadeNotifyItemAnim;
	animation-duration:0.2s;
	animation-fill-mode:forwards;
	opacity:0;
}

@keyframes fadeNotifyItemAnim {
	from {
		opacity: 1;
		transform: translateX(0px);
	}

	to {
		opacity: 0;
		transform: translateX(-8px);
		display: none;
	}
}

.timeslider {
}

.timeslider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	/* color: #df2a2a !important; */
}

.timeslider::-webkit-slider-runnable-tracks {
	-webkit-appearance: none;
	appearance: none;
	height: 2px;
}

.modecolp {
	color: var(--rowtxtcol);
	font-weight: var(--rowfontweight);
}
.modecolc {
	color: var(--rowtxtcol);
	font-weight: var(--rowfontweight);
}

</style>
