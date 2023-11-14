import './assets/main.css'

import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import First from './First.vue'
import Room from './Room.vue'
import Linkhead from './linkhead.vue'
import Scrolltest from './Scrolltest.vue'



const routes = [
	{ path: '/', name: 'first', component: First },
	{ path: '/App', name: 'app', component: App },
	{ path: '/Home', name: 'home', component: Home },
	{ path: '/Link', name: 'linkhead', component: Linkhead },
	{ path: '/Scroll', name: 'scrolltest', component: Scrolltest },
	{ path: '/Room/:id', name: 'room', component: Room, props: route => ({id: route.params.id}),},
	
]

const router = createRouter({
    history: createWebHistory(), // HTML5 History モード
    routes,
})

const app = createApp(First)
app.use(router)

app.mount('#app')
