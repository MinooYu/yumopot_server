<template>
	<div class="mlr-a" style=" margin-top: 12px; max-width: 900px; max-width: 1160px; max-height: 680px; display: flex; flex-wrap: wrap; padding: 6px 4px; overflow-y: scroll; overflow-x: hidden;">
		<div v-for="(data, i) in rooms" :key="i" class="fadeitem" style=" width: 217px; height: 120px; margin-bottom: 32px; margin-left: 6px; margin-right: 6px;">
			<div class="roomscell" style="text-align: center; user-select: none; display: flex; margin-left: auto; margin-right: auto; border-radius: 8px; font-size: 20px; color: #666;">
				<input type="radio" name="roomscell" :id="i" style="position: absolute; display: none;"><label :for="i" style="width: 217px; height: 120px; border-radius: 8px; padding-top: 44px; cursor: pointer;" v-on:click="roomid = data.id; roomname = data.name">{{ data.id }} : {{ data.name }}</label>
			</div>
		</div>
	</div>
	<div class="mlr-a" style="min-width: 880px; max-width: 1160px; margin-top: 32px;">

		<div class="mlr-a" style="width: 640px; display: flex;">
			<div v-if="roomid" class="mlr-a fadeUp12" style="width: 254px;  margin-top: 12px; background-color: #fff; border-radius: 32px; text-align: center; border: 1px solid #eee;">
				<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
				<router-link :to="{name: 'room', params: {id: roomid, name: roomname}}" style="text-decoration: none; color: rgb(34, 34, 34); text-align: center; display: flex;"><div class="mlr-a" style="width: 254px; height: 64px; border-radius: 32px; padding: 8px 24px; text-align: center; display: flex; justify-content: center; align-items: center; text-align: center; color: #c7d406;">to room</div></router-link>
			</div>

			<div class="mlr-a fadeUp12" style="width: 254px; font-size: 24px; text-align: center; margin-top: 12px; background-color: #fff; border-radius: 32px; text-align: center; height: 64px;">
				<input type="button" style="height: 64px; width: 254px; border-radius: 32px; border: 1px solid #333;" v-on:click="genroomflag = true" value="create room" />
				<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
			</div>
		</div>

		<div class="mlr-a fadeUp12" style="width: 124px; margin-top: 12px; ">
			<button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee; border: 1px solid #333;" v-on:click="roomview">rooms view</button>
		</div>

	</div>
	<div v-if="genroomflag" class="overlay" style=" z-index: 100; width: 100vw; height: 100vh; position: absolute; background-color: #eeeeeeaa; display: flex; justify-content: center; align-items: center; ">
		<div style="width: 640px; height: 420px; padding: 8px 24px; background-color: #fff; border-radius: 64px; text-align: center; display: block; margin: auto;">
			<div>
				<form @submit.prevent="roomflagch()">
					<input type="text" placeholder="RoomName" v-model="roomname" />
				</form>
				<form @submit.prevent="roomflagch()">
					<input type="password" placeholder="Password" />
				</form>
			</div>
			<div class="mlr-a" v-if="roomnameflag" style="width: 252px; height: 64px; margin-top: 12px; border-radius: 32px; border: 1px solid #111;">
				<!-- <router-link :to="{name: 'room', params: {id: randomcreateroomid}}" class="mlr-a" style="cursor: pointer; min-width: 254px; height: 64px; border-radius: 32px; text-decoration: none; color: rgb(34, 34, 34); text-align: center;"><div style="height: 64px; display: flex; align-items: center;"><label class="mlr-a" style="cursor: pointer;">create room</label></div></router-link> -->
				<router-link :to="{name: 'room', params: {id: randomcreateroomid, name: roomname}}" class="mlr-a" style="cursor: pointer; min-width: 254px; height: 64px; border-radius: 32px; text-decoration: none; color: rgb(34, 34, 34); text-align: center;"><div style="height: 64px; display: flex; align-items: center;"><label class="mlr-a" style="cursor: pointer;">create room</label></div></router-link>
			</div>
			<div v-on:click="genroomflag = false" style="width: 128px; height: 32px; border-radius: 16px; margin: auto; border: 1px solid #aaa; color: #aaa; margin-top: 12px; display: flex; justify-content: center; align-items: center;"> close </div>
		</div>
	</div>
</template>

<script>

import io from "socket.io-client";

export default {
	name: 'App',
	el: "#home",
	data: () => (
		{
			rooms: [],
			roomid: '',
			socket: io("http://localhost:3031"),
			randomcreateroomid: '',
			genroomflag: false,
			roomname: '',
			roomnameflag: false,
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
		});
		
	},
	methods: {
		genid() {
			this.roomid = getRndStr();
		},
		joinroom() {
			this.socket.emit("roomcreate", this.roomid, this.rooomname);
			this.socket.emit("joinroom", this.roomid);
		},
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

</style>
