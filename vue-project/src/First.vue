<template>
	<div style="height: 100vh; background-color: #eee;">
		<div style="width: 100%; padding: 12px 16px; margin-left: auto; margin-right: auto; text-align: center; position: sticky; display: flex;">
			<div style="width: 33%; display: flex;">
				<div style="right: 0; height: 42px; width: 42px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
			</div>
			<div style="width: 34%; display: flex; padding-top: 6px;">
				<router-link :to="{name: 'home'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none; color: #313131;">To Home</router-link>
				<router-link :to="{name: 'scrolltest'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none; color: #313131;">To test</router-link>
				<router-link :to="{name: 'home'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none; color: #313131;">To Home</router-link>
				<router-link :to="{name: 'home'}" v-on:click="flag = true" class="routerlink" style="margin-left: auto; font-size: 18px; margin-right: auto; text-decoration: none; color: #313131;">To Home</router-link>
			</div>
			<div style="width: 33%; display: flex; flex-direction: row-reverse;">
				<div style="right: 0; height: 42px; width: 42px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
				<div style="right: 0; height: 42px; width: 42px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
				<div style="right: 0; height: 42px; width: 42px; background-color: #888; border-radius: 6px; margin-left: 4px;"></div>
			</div>
		</div>

		<div style="background-color: #eee;">
			<router-view v-if="flag" />
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
			}
			else {
				this.flag = true
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
</style>
