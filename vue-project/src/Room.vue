<template>
	<!-- <div style="margin-left: auto; margin-right: auto;"><button :v-on:click="sendposts(sendmes)">send posts</button></div> -->
	<div class="mlr-a" style="width: 1200px;">
		<p style="margin-top: 12px; text-align: center;">{{ $route.params.id }}</p>
	</div>
	
	<div class="mlr-a" style="width: 1200px;">
		<div style="margin-top: 12px; width: 540px; margin-left: auto; margin-right: auto;">
			<input type="text" v-model="name" class="border-2 border-gray-400 rounded" placeholder="名前を変更" style="margin-right: 8px; width: 100%; text-align: center;"/>
			<form  @submit.prevent="sendposts(input)">
				<input type="text" v-model="input" class="border-2 border-gray-400 rounded" placeholder="メッセージを送信" style="margin-right: 8px; width: 100%; text-align: center;"/>
			</form>
			<!-- <input type="button" value="送信" @click="sendposts(input)" /> -->
		</div>
	</div>

	<!-- <div class="mlr-a" style="width: 1200px; display: flex;">
		<div style="margin-left: auto; margin-right: auto;"><button v-on:click="viewposts">view posts</button></div>
	</div> -->
	<div><a style="color: red;">{{ message }}</a></div>

	<div class="mlr-a" style="width: 1200px;">
		<div v-for="(post, i) in posts" :key="i" style="margin-left: auto; margin-right: auto; text-align: center;"><a>{{ post }}</a></div>
	</div>

</template>

<script>
import io from "socket.io-client";

export default {
	name: 'App',
	el: "#home",
	data: () => (
		{
			roomid: '',
			socket: io("http://localhost:3031"),
			posts: {},
			message: '',
			sendmes: 'test',
			input: '',
			name: '',
		}
	),
	created() {
		this.roomid = this.$route.params.id
		this.joinroom(this.roomid)
		// this.socket.emit("sendposts", this.roomid, "始めました");
		this.name = getRndStr();
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
		this.socket.on("viewposts", (posts) => {
			console.log(posts)
			this.posts = posts;
		});
		this.socket.on("err", (message) => {
			this.message = message;
		});
		
	},
	methods: {
		roomview() {
			this.socket.emit("roomview");
		},
		viewposts() {
			this.socket.emit("viewposts", this.roomid);
		},
		sendposts() {
			console.log(this.sendmes)
			console.log(this.roomid)
			this.socket.emit("sendposts", this.roomid, this.name, this.input);
			this.input = '';
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
