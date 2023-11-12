<template>
	<!-- <div style="margin-left: auto; margin-right: auto;"><button :v-on:click="sendposts(sendmes)">send posts</button></div> -->
	<div class="mlr-a" style="width: 1160px; display: flex; margin-top: 24px;">
		<div style="width: 840px; height: 460px;">
			<App :roomid="$route.params.id" :socket="socket"></App>
		</div>
		<div style="width: 320px;">
			<div class="mlr-a" style="width: 320px;">
				<div style="margin-top: 12px; width: 280px; margin-left: auto; margin-right: auto;">
					<div>
						<form  @submit.prevent="namech(name)">
							<input type="text" v-model="name" class="border-2 border-gray-400 rounded" placeholder="名前を変更" style="width: 100%; text-align: center; padding: 2px 4px; height: 24px; border-radius: 4px; border: 0.4px solid #777;"/>
						</form>
						<input type="color" v-model="mycolor" style="width: 280px; margin-top: 4px;" />
					</div>
					<div style="margin-top: 6px;">
						<form  @submit.prevent="sendposts(input)">
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


			<div class="mlr-a" id="scroller" style="width: 320px; height: 232px; margin-top: 8px; overflow-y: scroll;">
				<div v-for="(post, i) in posts" :key="i" style="width: 280px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: left; margin-top: 4px;"><a class="name">{{ post.name }} : </a><a>{{ post.post }}</a></div>
			</div>
			<div class="mlr-a" style="width: 320px; margin-top: 8px;">
				<div style="width: 152px; margin-bottom: 8px; padding: 4px 12px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: center; background-color: #eee; margin-top: 12px;"> users:{{ users.length }}</div>
			</div>
			<div class="mlr-a" style="width: 320px; height: 124px; margin-top: 8px; overflow-y: scroll;">
				<div v-for="(user, j) in users" :key="j" style="width: 280px; padding: 4px 12px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: center; background-color: #eee; margin-top: 4px;"><a>{{ user.name }}</a></div>
				<!-- <div style="width: 280px; padding: 4px 12px; border-radius: 4px; margin-left: auto; margin-right: auto; text-align: center; background-color: #eee; margin-top: 12px;"><a>{{ users }}</a></div> -->
			</div>
		</div>
	</div>

</template>

<script>
import io from "socket.io-client";
import App from './App.vue'

export default {
	name: 'Room',
	el: "#home",
	components: {
		'App': App,
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
	},
	created() {
		var name = getRndStr();
		console.log(name)
		this.name = name;
		this.roomid = this.$route.params.id
		this.joinroom(name)
		// this.socket.emit("sendposts", this.roomid, "始めました");
		
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

		this.socket.emit("viewposts", this.roomid);
		this.socket.emit("roominuser", this.roomid);
	},
	methods: {
		roomview() {
			this.socket.emit("roomview");
		},
		sendposts() {
			this.socket.emit("sendposts", this.roomid, this.name, this.input, this.mycolor);
			this.input = '';
		},
		joinroom(name) {
			this.socket.emit("roomcreate", this.roomid);
			this.socket.emit("joinroom", this.roomid, name);
		},
		roomview() {
			this.socket.emit("roomview");
		},
		namech() {
			this.socket.emit("namech", this.roomid, this.name);
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
