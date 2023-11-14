<template>
	<div class="mlr-a" style="margin-top: 12px; max-width: 900px; max-width: 1160px; max-height: 680px; display: flex; flex-wrap: wrap; padding: 6px 4px; overflow-y: scroll; overflow-x: hidden;">
		<div v-for="(data, i) in rooms" :key="i" class="fadeitem" style=" width: 217px; height: 120px; margin-bottom: 32px; margin-left: 6px; margin-right: 6px;">
			<div class="roomscell" style="text-align: center; user-select: none; display: flex; margin-left: auto; margin-right: auto; border-radius: 8px; font-size: 20px; color: #666;">
				<input type="radio" name="roomscell" :id="i" style="position: absolute; display: none;"><label :for="i" style="width: 217px; height: 120px; border-radius: 8px; padding-top: 44px; cursor: pointer;" v-on:click="roomid = data.id">{{ data.id }} : {{ data.name }}</label>
			</div>
		</div>
	</div>
	<div class="mlr-a" style="min-width: 880px; max-width: 1160px; margin-top: 32px;">

		<div class="mlr-a" style="width: 640px; display: flex;">
			<div v-if="roomid" class="mlr-a fadeUp12" style="width: 254px; font-size: 24px;  margin-top: 12px; background-color: #fff; border-radius: 32px; text-align: center;">
				<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
				<router-link :to="{name: 'room', params: {id: roomid}}" style="text-decoration: none; color: rgb(34, 34, 34);"><div style="width: 254px; height: 64px; border-radius: 32px; padding: 8px 24px;">to room</div></router-link>
			</div>

			<div class="mlr-a fadeUp12" style="width: 254px; font-size: 24px;  margin-top: 12px; background-color: #fff; border-radius: 32px; text-align: center;">
				<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
				<router-link :to="{name: 'room', params: {id: randomcreateroomid}}" style="text-decoration: none; color: rgb(34, 34, 34);"><div style="width: 254px; height: 64px; border-radius: 32px; padding: 8px 24px;">create room</div></router-link>
			</div>
		</div>

		<div class="mlr-a fadeUp12" style="width: 124px; margin-top: 12px; ">
			<button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee; border: 1px solid #222;" v-on:click="roomview">rooms view</button>
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
			this.socket.emit("roomcreate", this.roomid);
			this.socket.emit("joinroom", this.roomid);
		},
		roomview() {
			this.roomid = '';
			this.rooms = [];
			this.socket.emit("roomview");
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

</style>
