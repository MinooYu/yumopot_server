<template>
	<section class="sec-1">
		<h1 class="animate">Hi, Im yumooo</h1>
		<p class="animate">Animation on Scroll using HTML CSS and Javascrit</p>
	</section>
	<section class="sec-2">
		<h1 class="animate">Keep Scrolling</h1>
		<p class="animate">Animation on Scroll using HTML CSS and Javascrit</p>
	</section>
	<section class="sec-3">
		<h1 class="animate">Nice!</h1>
		<p class="animate">Animation on Scroll using HTML CSS and Javascrit</p>
	</section>

	<section class="sec-4">
		<h1>Very Good<span class="showRight-animate"></span></h1>
		<p>Animation on Scroll using HTML CSS and Javascrit<span class="showRight-animate"></span></p>
	</section>

	<section class="sec-5">
		<h1 class="animate">sec5</h1>
		<div class="images">
			<div class="animate imgcell" style="width: 400px; height: 120px; --i:0"><div style="width:360px; height: 200px; background-color: #fff; color: #fff; border-radius: 4px;">a</div></div>
			<div class="animate imgcell" style="width: 400px; height: 120px; --i:1"><div style="width:360px; height: 200px; background-color: #fff; color: #fff; border-radius: 4px;">a</div></div>
			<div class="animate imgcell" style="width: 400px; height: 120px; --i:2"><div style="width:360px; height: 200px; background-color: #fff; color: #fff; border-radius: 4px;">a</div></div>
		</div>
	</section>
	<section></section>
</template>

<script>
import io from "socket.io-client";
import { onDeactivated } from "vue";
import { RouterView } from "vue-router";

const minesenum = {dig:'dig',flag:'flag',none:'none'}

export default {
    name: 'scrolltest',
    el: "#first",
    data: () => ({
        
    }),
    created() {
    },
	watch: {
	},
    computed: {
	},
    mounted() {
		let sections = document.querySelectorAll('section');

		window.onscroll = () => {
			sections.forEach(sec => {
				let top = window.scrollY;
				// let offset = sec.offsetTop - 150;
				let offset = sec.offsetTop - 250;
				let height = sec.offsetHeight;

				if (top >= offset && top < offset + height) {
					sec.classList.add('show-animate');
				}
				else {
					sec.classList.remove('show-animate')
				}
			})
		}
    },
    methods: {},
}
</script>

<style scoped>

section {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	min-height: 50vh;
	background: rgb(180, 180, 169); 
	overflow-x: hidden;
}

h1 {
	position: relative;
	font-size: 90px;
	color: #e9e9de;
	font-weight: 800;
}

p {
	position: relative;
	font-size: 35px;
	font-weight: 400;
}

section .animate {
	filter: blur(2px);
	transition: 0.6s;
}

section.show-animate .animate {
	filter: blur(0);
	transition: 0.6s;
}

.sec-1 .animate {
	transform: translateX(-100%);
}

.sec-1.show-animate .animate {
	transform: translateX(0);
}

.sec-2 p {
	color: #6d6d22;
}

.sec-2 .animate {
	transform: translateX(100%);
}

.sec-2.show-animate .animate {
	transform: translateX(0);
}

.sec-3 p {
	color: #7c5b1a;
}

.sec-3 .animate {
	transform: scale(.4);
}

.sec-3.show-animate .animate {
	transform: scale(1);
}

.sec-4 .showRight-animate {
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background-color: black;
	background: rgb(180, 180, 169);
	transition: .8s;
}

.sec-4.show-animate .showRight-animate {
	width: 0;
}

.sec-5 .images {
	display: flex;
	max-width: 1200px;
}

.sec-5 .images .imgcell {
	transform: translateX(-32%);
	transition-delay: calc(.2s * var(--i));
}
.sec-5.show-animate .images .imgcell {
	transform: translateX(0);
}

.mlr-a {
	margin-left: auto; margin-right: auto;
}
</style>
