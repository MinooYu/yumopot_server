<template>
	<div style="height: 100vh; background-color: #eee; overflow-x: hidden;" id="target" v-on:click="clickpoint">
		<div v-if="headerflag" style="width: 100%; padding: 12px 16px; margin-left: auto; margin-right: auto; text-align: center; position: sticky; display: flex;">
			<div style="width: 33%; display: flex;">
				<div style="right: 0; height: 42px; width: 42px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
			</div>

			<div style="width: 34%; display: flex; padding-top: 6px;" class="fncbtn">
				<router-link :to="{name: 'home'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To Home</router-link>
				<!-- <router-link :to="{name: 'scrolltest'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To test</router-link> -->
				<router-link :to="{name: 'QRCodeGen'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To QRCodeGen</router-link>
				<router-link :to="{name: 'Playroom'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To Playroom</router-link>
			</div>

			<div style="width: 33%; display: flex; flex-direction: row-reverse;" class="fncbtn">
				<router-link :to="{name: 'login'}" v-on:click="flag = true" class="routerlink" style="height: 42px; width: 100px; background-color: #fff; border-radius: 6px; margin-left: 16px; display: flex; align-items: center; text-align: center; text-decoration: none; user-select: none;">
					<label style="width: 100px;">login</label>
				</router-link>
				<!-- <div style="right: 0; height: 42px; width: 64px; background-color: #fff; border-radius: 6px; margin-left: 4px; display: flex; align-items: center; text-align: center;"><label style="width: 64px;">login</label></div> -->
				<div v-if="!login_Username" style="right: 0; height: 42px; width: 100px; background-color: #888; border-radius: 6px; margin-left: 16px;"></div>
				<div v-else style="right: 0; height: 42px; width: 100px; background-color: #fff; border-radius: 6px; margin-left: 16px; display: flex; align-items: center; text-align: center; text-decoration: none; user-select: none;"  v-on:click="notimodalflag = !notimodalflag;"><label style="width: 100px;">Conf</label></div>
				<div style="right: 0; height: 42px; width: 100px; background-color: #888; border-radius: 6px; margin-left: 16px;"></div>
			</div>
		</div>

		<div v-if="!firstpage" style="background-color: #eee;">
			<router-view />
		</div>
	</div>

	<div class="mlr-a" v-if="notimodalflag" style="position: fixed; top: 52px; right: calc((100vw - 98vw) / 2); margin-top: 12px;" v-bind:class="{ 'notifyitems-anim': notimodalflag }">
		<div class="mlr-a" style=" width: 324px; min-height: 212px; max-height: 212px; margin-top: 8px; background-color: #fff; border-radius: 24px; padding: 8px 24px; filter: drop-shadow(0 0 6px #c6c6c6); align-items: center; overflow-y: scroll; overflow-x: hidden;">
			<div>
				<label> user : </label>
				<label style=" font-size: 24px;">{{ login_Userinfo.username }}</label>
			</div>

			<div style="height: 64px;">
				<!-- <label>color : </label>
				<label style=" font-size: 24px;">{{ login_Userinfo.username }}</label> -->
			</div>
			<div style="height: 64px;">
			</div>

			<div style="position: absolute; top: 12px; right: 6px;">
				<vue-qrcode v-if="targetData" :value="targetData" :options="option" tag="img"></vue-qrcode>
			</div>

			<div>
				<label style=" font-size: 12px;">{{ login_Userinfo.userHash }}</label>
			</div>
		</div>
	</div>

</template>

<script>
import io from "socket.io-client";
import { RouterView } from "vue-router";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";

const minesenum = {dig:'dig',flag:'flag',none:'none'}

export default {
    name: 'App',
    el: "#first",
	components: { RouterView,VueQrcode, },
    data: () => ({
        roomid: '',
        socket: io("http://localhost:3031"),
		flag: false,
		headerflag: true,
		firstpage: false,

		notifydata: [],
		notifydatalen: 0,
		notimodalflag: false,

		targetData: "",
		option: {
			errorCorrectionLevel: "M",
			maskPattern: 0,
			margin: 4,
			scale: 2,
			width: 64,
			color: {
			dark: "#000000FF",
			light: "#FFFFFFFF"
			}
		},
		
    }),
    created() {
        this.socket.on("connect", () => {
            console.log("connected");
            this.socket.emit("helloroom");
        });
    },
	watch: {
		$route(newRoute, oldRoute) {
			const path = newRoute.fullPath
			console.log(newRoute)

			if (path == "/") {
				this.flag = false
				this.firstpage = true
				this.$router.push('/Home')
			}
			else if(path == "/Login") {
				this.headerflag = false
				this.firstpage = false
			}
			else {
				this.flag = true
				this.headerflag = true
				this.firstpage = false
			}
		},
		login_Username (val, old) {
			console.log("username")
			console.log(val)
		},
		login_Userinfo (val, old) {
			console.log("userinfo")
			console.log(val)

			this.generate()
		},
	},
    computed: {
		login_Username() {return this.$store.getters.getUsername;},
		login_Userinfo() {return this.$store.getters.getUserinfo;},
	},
    mounted() {
        this.socket.on("hello", (str, cnt) => {
            console.log(str);
            this.connectcnt = cnt;
        });

		this.socket.on("notify", (data) => {
			this.notifydatalen = 0;
			this.notifydata.push(data)
			this.notifydata.forEach(element => {
				if(!element.readflag) this.notifydatalen ++;
			});
		});
    },
    methods: {
		generate: function() {
			const json = '{"username":"' + this.login_Userinfo.username +'", "pass":"' + this.login_Userinfo.password + '"}';
			this.targetData = json;
			this.rommjsondata = JSON.parse(json);
		},
		clickpoint(event) {
			var x = event.pageX ;
			var y = event.pageY ;
			console.log(x, y)
		}
	},
}
</script>

<style scoped>
.mlr-a {
	margin-left: auto; margin-right: auto;
}

.fncbtn div:hover{
	transition: 0.2s;
	transform: translateY(-1.2px);
	color: #525252;
}

.fncbtn a{
	transition: 0.2s;
	color: #313131;
}

.fncbtn a:hover{
	transform: translateY(-1.2px);
	color: #7a7a7a;
}

.notifyitems-anim {
	animation-name:fadeNotifyItemAnim;
	animation-duration:0.2s;
	animation-fill-mode:forwards;
	opacity:1;
}

@keyframes fadeNotifyItemAnim {
	from {
		opacity: 0;
		transform: translateY(8px);
	}

	to {
		opacity: 1;
		transform: translateY(0px);
	}
}
</style>
