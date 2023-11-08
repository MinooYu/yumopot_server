<template>
	<div class="mlr-a" style="width: 1200px;">
		<p style="margin-top: 12px; text-align: center;">{{ $route.params.id }}</p>
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
		}
	),
	created() {
		this.socket.on("connect", () => {
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
			this.roomid = uuid_gen();
			this.socket.emit("roomcreate", this.roomid);
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
