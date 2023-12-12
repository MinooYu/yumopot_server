<template>
	<section class="sec-1">

		<div class="container" id="container">
			<div class=" form-container sign-up">
				<form @submit.prevent>
					<h1>Create Account</h1>
					<input type="text" placeholder="Name" />
					<input type="password" placeholder="Password" />
					<button id="register" v-on:click="removeActive()">Sign Up</button>
				</form>
			</div>

			<div class="form-container sign-in">
				<form @submit.prevent>
					<h1>Sign In</h1>
					<input type="text" placeholder="Name" />
					<input type="password" placeholder="Password" />
					<a>Forget Your Password</a>
					<button id="login" v-on:click="addActive()">Sign In</button>
				</form>
			</div>
			<div class="toggle-container">
				<div class="toggle">
					<div class="toggle-panel toggle-right">
						<h1>Welcome back!</h1>
						<p>Enter your parsonal site</p>
						<button class="hidden" id="login" v-on:click="addActive()">Sign Up</button>
					</div>
					<div class="toggle-panel toggle-left">
						<h1>Hello, Friend!</h1>
						<p>Enter your parsonal site</p>
						<button class="hidden" id="register" v-on:click="removeActive()">Sign In</button>
					</div>
				</div>
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
		container: null,
		registerBtn: null,
		loginBtn: null,
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
		this.container = document.getElementById('container');
		this.registerBtn = document.getElementById('register');
		this.loginBtn = document.getElementById('login');

		

		
    },
    methods: {
		removeActive() {
			this.container.classList.remove("active");
		},
		addActive() {
			this.container.classList.add("active");
		}
	},
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

.container {
	background-color: #fff;
	border-radius: 32px;
	box-shadow: 0 5px 15px #00000080;
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
}

.container h1 {
	font-size: 32px;
	font-weight: 600;
}

.container p {
	font-size: 16px;
	font-weight: 300;
	line-height: 20px;
	letter-spacing: 0.3px;
	margin: 20px 0;
}

.container a {
	font-size: 13px;
	color: #333;
	text-decoration: none;
	margin: 15px 0 10px;
	cursor: pointer;
}

.container button {
	background-color: #d4b00c;
	color: #3a3a3a;
	font-size: 16px;
	padding: 8px 44px;
	border: 1px solid transparent;
	border-radius: 8px;
	font-weight: 600;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	margin-top: 10px;
	cursor: pointer;
}

.container button.hidden {
	background-color: transparent;
	border: 1px solid #eee;
	color: #eee;
}

.container form {
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	height: 100%;
}

.container input {
	background-color: #eee;
	border: none;
	margin: 8px 0;
	padding: 10px 16px;
	font-size: 13px;
	border-radius: 8px;
	width: 100%;
	outline: none;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.sign-in {
	left: 0;
	width: 50%;
	z-index: 2;
}

.container.active .sign-in {
	transform: translateX(100%);
}

.sign-up {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.container.active .sign-up {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: move 0.6s;
}

@keyframes move {
	0%, 49.99% {
		opacity: 0;
		z-index: 1;
	}
	50%, 100% {
		opacity: 1;
		z-index: 5;
	}
}

.toggle-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: all 0.6s ease-in-out;
	border-radius: 150px 0 0 100px;
	z-index: 1000;
}

.container.active .toggle-container{
	transform: translateX(-100%);
	border-radius: 0 150px 100px 0;
}

.toggle {
	background-color: #d4b00c;
	height: 100%;
	background: linear-gradient(
		to right, #e0bf29 #d4b00c);
	color: #fff;
	position: #fff;
	left: relative;
	left: -100%;
	height: 100%;
	width: 200%;
	transform: translateX(0);
	transition: all 0.6s ease-in-out;
}

.container.active .toggle {
	transform: translateX(-50%);
}

.toggle-panel {
	position: absolute;
	width: 50%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 30px;
	text-align: center;
	top: 0;
	transform: translateX(0);
	transition: all 0.6s ease-in-out;
}

.toggle-left {
	right: 0;
	transform: translateX(-200%);
}

.container.active .toggle-left {
	transform: translateX(0);
}

.toggle-right {
	transform: translateX(0);
}

.container.active .toggle-right {
	transform: translateX(200%);
}

/* input[type="text"] {
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
} */

</style>
