<template>
	<loading
		v-model:active="isLoading"
		:can-cancel="true"
		:on-cancel="onCancel"
		:is-full-page="true">
	</loading>

	<div v-if="editflag" class="overlay" style=" z-index: 100; width: 100vw; height: 100vh; position: absolute; background-color: #eeeeeecc; display: flex; justify-content: center; align-items: center; ">
		<div class="mlr-a" style="width: 524px; margin-top: 212px;">
			<div style="height: 172px; margin-bottom: 40px;">
				<div class="mlr-a" style="text-align: center;">
					<div style="font-size: 28px;">
						edit roomname :
					</div>
					<!-- <div  style="font-size: 44px; font-weight: 400;">
						{{ roomname }}
					</div> -->
				</div>
				<div class="mlr-a" style="margin-bottom: 12px; margin-top: 32px;">
					<form @submit.prevent="" class="mlr-a" style="width: 524px;">
						<input v-model="editroomname" class="mlr-a roomeditinput" style="width: 524px; text-align: center; background-color: transparent; color: #2c3e50; padding: 4px 12px; border-radius: 4px; border: 0px solid #333; font-size: 52px; font-weight: 400;" placeholder="roomname">
					</form>
				</div>
			</div>
			<div style="height: 252px;">
				<div style="margin-left: auto; margin-right: auto; width: 400px;">
					<input type="button" style="height: 64px; width: 352px; margin-left: 24px; margin-right: 24px; border-radius: 32px; border: 1px solid #333; cursor: pointer;" v-on:click="roomedit()" value="submit" />
				</div>
				<div style="margin-left: auto; margin-right: auto; width: 400px;">
					<input type="button" style="height: 52px; width: 352px; margin-top: 12px; margin-left: 24px; margin-right: 24px; border-radius: 26px; border: 1px solid #333; cursor: pointer; background-color: #dd3030; color: #eee; font-weight: 600; font-size: 16px;" v-on:click="roomdel()" value="del room" />
				</div>
				<div v-on:click="editflag = false" style="width: 128px; height: 32px; border-radius: 16px; margin-left: auto; margin-right: auto; margin-top: 80px; border: 1px solid #111; color: #111; display: flex; justify-content: center; align-items: center; cursor: pointer;"> close </div>
			</div>
		</div>
	</div>

	<div class="mlr-a" style=" margin-top: 12px; max-width: 900px; max-width: 1160px; min-height: 520px; max-height: 520px; display: flex; flex-wrap: wrap; padding: 6px 4px; overflow-y: scroll; overflow-x: hidden;">
		<div v-if="rooms.length == 0" style="text-align: center; align-items: center; margin: auto;"> <div style=" margin: auto; text-align: center; font-size: 64px; font-weight: 600;">Not Found Rooms</div><div style=" font-weight: 400; font-size: 24px; margin: auto; text-align: center;">Click rooms view</div></div>
		<div v-else v-for="(data, i) in rooms" :key="i" class="fadeitem" style=" width: 217px; height: 120px; margin-bottom: 32px; margin-left: 6px; margin-right: 6px;">
			<div class="roomscell" style="text-align: center; user-select: none; display: flex; margin-left: auto; margin-right: auto; border-radius: 8px; font-size: 20px; color: #666;">
				<input type="radio" name="roomscell" :id="i" style="position: absolute; display: none;"><label :for="i" style="width: 217px; height: 120px; border-radius: 8px; padding-top: 44px; cursor: pointer;" v-on:click="roomid = data.id; roomname = data.name; editroomname = data.name">{{ data.name }}</label>
			</div>
		</div>
	</div>

	<div class="mlr-a" style="min-width: 880px; max-width: 1160px; margin-top: 32px;">

		<div v-if="roomid && !editflag">
			<div class="mlr-a fadeUp12" style="width: 254px;  margin-top: 12px; background-color: #fff; border-radius: 32px; text-align: center; border: 1px solid #eee;">
				<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
				<router-link :to="{name: 'room', params: {id: roomid, name: roomname}}" style="text-decoration: none; color: rgb(34, 34, 34); text-align: center; display: flex;"><div class="mlr-a" style="width: 254px; height: 64px; border-radius: 32px; padding: 8px 24px; text-align: center; display: flex; justify-content: center; align-items: center; color: #c7d406;">to room</div></router-link>
			</div>
			<div class="mlr-a fadeUp12" style="width: 254px;  margin-top: 12px; border-radius: 32px; text-align: center; border: 1px solid #333; text-decoration: none; display: flex;">
				<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
				<div class="mlr-a" v-on:click="editflag = true" style="width: 254px; height: 64px; border-radius: 32px; padding: 8px 24px; text-align: center; display: flex; justify-content: center; align-items: center; color: #111; cursor: pointer;">edit room</div>
			</div>
		</div>

		<div class="mlr-a fadeUp12" style="width: 254px; font-size: 24px; text-align: center; margin-top: 12px; background-color: #fff; border-radius: 32px; text-align: center; height: 64px; cursor: pointer;">
			<input type="button" style="height: 64px; width: 254px; border-radius: 32px; border: 1px solid #333; cursor: pointer;" v-on:click="genroomflag = true" value="create room" />
			<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
		</div>
		<div class="mlr-a fadeUp12" style="width: 124px; margin-top: 12px; ">
			<button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee; border: 1px solid #333; cursor: pointer;" v-on:click="roomview(); editflag = false">rooms view</button>
		</div>
	</div>
	<div v-if="genroomflag" class="overlay" style=" z-index: 100; width: 100vw; height: 100vh; position: absolute; background-color: #eeeeeeee; display: flex; justify-content: center; align-items: center; text-align: center;">
		<div>
			<div>
				<label style="font-weight: 400; font-size: 42px;">select room</label>
			</div>
			<div style="width: 380px; margin: auto; margin-bottom: 12px; text-align: center; font-size: 24px; font-weight: 600; display: flex;">
				<div class="modecolp" :style="modecolp" v-on:click="roomkind = 1" style="width: 180px; height: 48px; margin: auto; display: flex; border-radius: 12px; user-select: none;"><label style=" margin: auto; display: flex; justify-content: center; align-items: center; border-radius: 12px;">playlist</label></div>
				<div class="modecolc" :style="modecolc" v-on:click="roomkind = 2" style="width: 180px; height: 48px; margin: auto; display: flex; border-radius: 12px; user-select: none"><label style="margin: auto; display: flex; justify-content: center; align-items: center; border-radius: 12px;">chat</label></div>
			</div>
			<div style="height: 172px; margin-top: 32px;">
				<div class="mlr-a" style="margin-bottom: 12px; margin-top: 32px;">
					<form @submit.prevent="roomflagch()" class="mlr-a" style="width: 524px;">
						<input v-model="createroom_roomname" class="mlr-a roomeditinput" placeholder="roomname" style="width: 524px; text-align: center; background-color: transparent; color: #2c3e50; padding: 4px 12px; border-radius: 4px; border: 0px solid #333; font-size: 52px; font-weight: 400;">
					</form>
					<form @submit.prevent="roomflagch()" class="mlr-a" style="width: 524px;">
						<input v-model="createroom_password" type="password" class="mlr-a roomeditinput" placeholder="Password" style="width: 524px; text-align: center; background-color: transparent; color: #2c3e50; padding: 4px 12px; border-radius: 4px; border: 0px solid #333; font-size: 52px; font-weight: 400;">
					</form>
				</div>
			</div>

			<div style="height: 152px;">
				<div class="mlr-a fadeUp12" v-if="createroom_roomname && createroom_password" style="width: 252px; height: 64px; margin-top: 12px; border-radius: 32px; border: 1px solid #111;">
					<!-- <router-link :to="{name: 'room', params: {id: randomcreateroomid}}" class="mlr-a" style="cursor: pointer; min-width: 254px; height: 64px; border-radius: 32px; text-decoration: none; color: rgb(34, 34, 34); text-align: center;"><div style="height: 64px; display: flex; align-items: center;"><label class="mlr-a" style="cursor: pointer;">create room</label></div></router-link> -->
					<router-link :to="{name: 'room', params: {id: randomcreateroomid, name: createroom_roomname, roomkind: roomkind}}" class="mlr-a" style="cursor: pointer; min-width: 254px; height: 64px; border-radius: 32px; text-decoration: none; color: rgb(34, 34, 34); text-align: center;"><div style="height: 64px; display: flex; align-items: center;"><label class="mlr-a" style="cursor: pointer;">create room</label></div></router-link>
				</div>

				<div v-on:click="genroomflag = false; createroom_roomname = null; createroom_password = null; " style="width: 128px; height: 32px; border-radius: 16px; margin: auto; border: 1px solid #666; color: #666; margin-top: 12px; display: flex; justify-content: center; align-items: center;"> close </div>
			</div>
		</div>
	</div>
</template>

<script>

import io from "socket.io-client";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
	name: 'App',
	el: "#home",
	components: {
		"loading":Loading,
	},
	data: () => (
		{
			rooms: [],
			roomid: '',
			socket: io("http://localhost:3031"),
			randomcreateroomid: '',
			genroomflag: false,
			
			roomname: '',
			roomnameflag: false,
			isLoading: false,
			
			editflag: false,
			editroomname:'',
			selectroomhash:'',
			
			createroom_roomname:'',
			createroom_password:'',

			roomkind: 1,
		}
	),
	created() {
		// this.genid();
		this.randomcreateroomid = getRndStr()
		this.socket.on("connect", () => {
			console.log("connected");
			this.socket.emit("helloroom");
		});
	},
	computed: {
		modecolp() {
			if(this.roomkind == 1) {
				return {
					'--rowtxtcol' : "#2c3e50",
					'--rowcal' : "#fff"
				}
			}
			return {
				'--rowtxtcol' : "#aaa",
				'--rowcal' : "#fafafa"
			}
			
		},
		modecolc() {
			if(this.roomkind == 2) {
				return {
					'--rowtxtcol' : "#2c3e50",
					'--rowcal' : "#fff"
				}
			}
			return {
				'--rowtxtcol' : "#aaa",
				'--rowcal' : "#fafafa"
			}
			
		},
	},
	watch: {
		rooms(newval, oldval) {
			this.$nextTick(() => {
				let targets = document.getElementsByClassName('fadeitem');
				console.log(targets);

				// targets.forEach((element, index) => {
				// 	setTimeout(function() {
				// 		element.classList.add("fadeUp")
				// 	}, index * 2000);
				// });

				Array.prototype.forEach.call(targets, function (element, index) {
					setTimeout(function() {
						element.classList.add("fadeUp")
					}, index * 32);
				});
			})
		},
		notifydata() {

		}
	},
	mounted() {
		this.socket.on("hello", (str, cnt) => {
			console.log(str);
			this.connectcnt = cnt;
		});
		this.socket.on("roomview", (rooms) => {
			this.rooms = rooms;
			this.editflag = false;
			this.isLoading = false;
		});
		
	},
	methods: {
		genid() {
			this.roomid = getRndStr();
		},
		// joinroom() {
		// 	this.socket.emit("roomcreate", this.roomid, this.rooomname, this.roomkind);
		// 	this.socket.emit("joinroom", this.roomid);
		// },
		roomview() {
			this.roomid = '';
			this.rooms = [];
			this.socket.emit("roomview");
		},
		roomflagch() {
			this.roomnameflag = true;
		},
		roomset(dataid, dataname) {
			this.roomid = dataid;
			this.roomname = dataname;
		},
		roomdel() {
			this.doLoading()
			this.socket.emit("roomdel", this.roomid);
		},
		roomedit() {
			this.doLoading();
			this.socket.emit("roomedit", this.roomid, this.editroomname);
		},
		doLoading: function () {
			let self = this;
			self.isLoading = true;
			setTimeout(function() {
				self.isLoading = false;
				console.log("timeout");
			}, 100000);
		},
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

.roomscell label {
	background-color: #f5f5f5;
}
.roomscell input:checked+label{
    background: #fff;
    color: #c7d406;
	animation-name:itemclick;
	animation-duration:0.4s;
	animation-fill-mode:forwards;
}

@keyframes itemclick{
	from {
		opacity: 1;
		transform: translateY(-4px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.fadeitem {
	opacity:0;
}

.fadeUp{
	animation-name:fadeupAnime;
	animation-duration:0.4s;
	animation-fill-mode:forwards;
	opacity:0;
}

@keyframes fadeupAnime{
	from {
		opacity: 0;
		transform: translateY(24px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}


.fadeUp12{
	animation-name:fadeup12Anime;
	animation-duration:0.4s;
	animation-fill-mode:forwards;
	opacity:0;
}

@keyframes fadeup12Anime{
	from {
		opacity: 0;
		transform: translateY(6px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.overlay {
	position:fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
}

.roomeditinput:focus {
	outline: none;
}

.modecolp {
	color: var(--rowtxtcol);
	background-color: var(--rowcal);
}
.modecolc {
	color: var(--rowtxtcol);
	background-color: var(--rowcal);
}
</style>
