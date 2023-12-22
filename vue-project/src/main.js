import './assets/main.css'
import {createStore} from 'vuex'

import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import First from './First.vue'
import Room from './Room.vue'
import Linkhead from './linkhead.vue'
import Scrolltest from './ScrollTest.vue'
import Login from './Login.vue'
import QRCodeGen from './QRCodeGen.vue'
import Playroom from './youtubePlayroom.vue'

const store = createStore({
	state () {
		return {
			login_username: "",
			login_userHash: "",
			userinfo:{},
		}
	},
	getters: {
		getUsername: state => {
			return state.login_username;
		},
		getUserHash: state => {
			return state.login_userHash;
		},
		getUserinfo: state => {
			return state.userinfo;
		},
		

	},
	mutations: {
		set_username(state, username) {
			state.login_username = username;
		},
		set_userHash(state, userHash) {
			state.login_userHash = userHash;
		},
		set_userinfo(state, userinfo) {
			state.userinfo = userinfo;
		},
	},
	actions: {
		set_username (context, username) {
			context.commit('set_username', username);
		},
		set_userHash (context, userHash) {
			context.commit('set_userHash', userHash);
		},
		set_userinfo (context, userinfo) {
			context.commit('set_userinfo', userinfo);
			context.commit('set_username', userinfo.username);
		},
	}

})

const routes = [
	{ path: '/', name: 'first', component: First },
	{ path: '/App', name: 'app', component: App },
	{ path: '/Home', name: 'home', component: Home },
	{ path: '/Link', name: 'linkhead', component: Linkhead },
	{ path: '/Scroll', name: 'scrolltest', component: Scrolltest },
	{ path: '/QRCodeGen', name: 'QRCodeGen', component: QRCodeGen },
	{ path: '/Playroom', name: 'Playroom', component: Playroom },
	{ path: '/Login', name: 'login', component: Login },
	{ path: '/Room/:id/:name/:roomkind', name: 'room', component: Room, props: route => ({id: route.params.id},{name: route.params.name},{roomkind: route.params.roomkind}),},
	
	
]

const router = createRouter({
    history: createWebHistory(), // HTML5 History モード
    routes,
})

const app = createApp(First)
app.use(router)
app.use(store)

app.mount('#app')
