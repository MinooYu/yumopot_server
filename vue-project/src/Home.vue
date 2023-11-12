<template>
	<div class="mlr-a" style="width: 1200px;">

		<div style="height: 624px;">
		</div>
		<div class="mlr-a" style="width: 254px; height: 64px; font-size: 24px;  margin-top: 12px; background-color: #eee; padding: 8px 24px; border-radius: 32px; text-align: center;">
			<!-- <button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee;" v-on:click="genid">create room</button> -->
			<router-link :to="{name: 'room', params: {id: roomid}}" style="width: 124px; text-decoration: none; color: rgb(34, 34, 34);">to room</router-link>
		</div>

		<!-- <div class="mlr-a" style="width: 124px; margin-top: 12px; ">
			<button style="width: 124px; padding: 8px 24px; border-radius: 8px; background-color: #eee; border: 1px solid #222;" v-on:click="roomview">rooms view</button>
		</div> -->

		<!-- <div style="margin-top: 12px;">
			<p v-for="(data, i) in rooms" :key="i" style="text-align: center;"> {{ data }}</p>
		</div> -->

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
		}
	),
	created() {
		this.genid();
		this.socket.on("connect", () => {
			console.log("connected");
			this.socket.emit("helloroom");
		});
	},
	computed: {

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
</style>
