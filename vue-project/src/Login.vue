<template>
	<section class="sec-1">
		<div style="text-align: center; width: 364px; height: 232px; background-color: #ffffff; border-radius: 8px; border: 1px solid #c9c9c9;">
			<h1 class="animate" style="font-size: 46px;">login</h1>

			<div style="margin-top: 12px;">
				<p style="font-size: 16px;"> name </p>
				<form>
					<input type="text" style="width: 164px;" />
				</form>
			</div>

			<div style="margin-top: 12px;">
				<p style="font-size: 16px;"> password </p>
				<form>
					<input type="text" style="width: 164px;" />
				</form>
			</div>
		</div>
	</section>
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
		flag: false,

		notifydata: [],
		notifydatalen: 0,
		notimodalflag: false,
    }),
    created() {

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
    },
    methods: {},
}
</script>

<style scoped>
.mlr-a {
	margin-left: auto; margin-right: auto;
}

section {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	min-height: 100vh;
	overflow-x: hidden;
}

input[type="text"] {
	border: 1px solid #757575;
	border-radius: 4px;
	padding: 2px 8px;
	font-size: 16px;
}

input[type="text"]:focus {
	border: 1px solid #a18a08;
	border-radius: 4px;
	padding: 2px 8px;
	outline: 0;
}

</style>
