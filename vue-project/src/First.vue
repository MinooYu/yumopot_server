<template>
	<div style="height: 100vh; background-color: #eee;">
		<div v-if="headerflag" style="width: 100%; padding: 12px 16px; margin-left: auto; margin-right: auto; text-align: center; position: sticky; display: flex;">
			<div style="width: 33%; display: flex;">
				<div style="right: 0; height: 42px; width: 42px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
			</div>
			<div style="width: 34%; display: flex; padding-top: 6px;" class="fncbtn">
				<router-link :to="{name: 'home'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To Home</router-link>
				<router-link :to="{name: 'scrolltest'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To test</router-link>
				<router-link :to="{name: 'QRCodeGen'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To QRCodeGen</router-link>
				<router-link :to="{name: 'home'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none;">To Home</router-link>
			</div>
			<div style="width: 33%; display: flex; flex-direction: row-reverse;" class="fncbtn">
				<router-link :to="{name: 'login'}" v-on:click="flag = true" class="routerlink" style="height: 42px; width: 64px; background-color: #fff; border-radius: 6px; margin-left: 4px; display: flex; align-items: center; text-align: center; text-decoration: none;"><label style="width: 64px;">login</label></router-link>
				<!-- <div style="right: 0; height: 42px; width: 64px; background-color: #fff; border-radius: 6px; margin-left: 4px; display: flex; align-items: center; text-align: center;"><label style="width: 64px;">login</label></div> -->
				<div style="right: 0; height: 42px; width: 64px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
				<div style="right: 0; height: 42px; width: 64px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
			</div>
		</div>
		<div v-if="!firstpage" style="background-color: #eee;">
			<router-view />
		</div>
	</div>
	
</template>

<script>
import io from "socket.io-client";
import { RouterView } from "vue-router";

const minesenum = {dig:'dig',flag:'flag',none:'none'}

export default {
    name: 'App',
    el: "#first",
    data: () => ({
        roomid: '',
        socket: io("http://localhost:3031"),
		flag: false,
		headerflag: true,
		firstpage: false,

		notifydata: [],
		notifydatalen: 0,
		notimodalflag: false,
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
	},
    computed: {
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
    methods: {},
    components: { RouterView }
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
</style>
