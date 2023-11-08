<template>
	<div v-if="!flag" style="width: 400px; margin-left: auto; margin-right: auto; text-align: center;">
		<router-link :to="{name: 'home'}" v-on:click="flag = true" style="margin-right: 12px;">to home</router-link>
		<router-link :to="{name: 'app'}" v-on:click="flag = true">to app</router-link>
	</div>
	
	<router-view v-if="flag" />
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
    }),
    created() {
        this.socket.on("connect", () => {
            console.log("connected");
            this.socket.emit("helloroom");
        });
    },
    computed: {},
    mounted() {
        this.socket.on("hello", (str, cnt) => {
            console.log(str);
            this.connectcnt = cnt;
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
