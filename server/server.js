const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const { log } = require("console");
const { Socket } = require("net");
const app = express();
const redis = require('redis');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true,
	optionsSuccessStatus: 200
}));

var server = http.createServer(app);
server.listen(3031);
var users = [];
var Canvas = [];
var connectedcnt = 0
const rooms = [];
const minesroom = {id: "mineswiper_room", users: [], posts: []}
rooms.push(minesroom);

const io = require("socket.io")(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

async function initroomdata() {
	var  initroomidkeys = await redis_data_get_allkey(0);
	var initroomidkeyvals = await redis_data_getter_key_val_map(0, initroomidkeys)
	console.log(initroomidkeyvals)

	initroomidkeys.forEach((element, index) => {
		const initroom = {id: element, users: [], posts: []}
		rooms.push(initroom);
	});
}

initroomdata();

io.on("connection", async (socket) => {
	connectedcnt ++;

	// socket.on("joinmineswiper", async () => {
	// 	socket.join('mineswiper_room');
	// 	io.to('mineswiper_room').emit("hello", 'helllooooo!!', connectedcnt);
	// });
	socket.on("initcanvas", async (roomid, canvasitem) => {
		const Canvasindex = Canvas.findIndex((r) => r.id == roomid);
		if(Canvasindex != -1) {
			io.to(roomid).emit("canvas", Canvas[Canvasindex].canvas);
		}
		else { 
			var canvas = {id: roomid, canvas: canvasitem}
			Canvas.push(canvas);
		}
	});

	socket.on("canvas", async (roomid, canvasitem) => {
		const Canvasindex = Canvas.findIndex((r) => r.id == roomid);
		if(Canvasindex != -1) { Canvas[Canvasindex].canvas = canvasitem; io.to(roomid).emit("canvas", Canvas[Canvasindex].canvas); }
		else { 
			return
		}
	});

	socket.on("paint", async (roomid, x, y) => {
		io.to(roomid).emit("paint", x, y);
	});

	socket.on("dragStart", async (roomid, x, y) => {
		io.to(roomid).emit("dragStart", x, y);
	});

	socket.on("dragEnd", async (roomid) => {
		io.to(roomid).emit("dragEnd");
	});

	socket.on("colorch", async (roomid, colorstr, stylenum) => {
		io.to(roomid).emit("colorch", colorstr, stylenum);
	});

	socket.on("widthch", async (roomid, linewidth) => {
		io.to(roomid).emit("widthch", linewidth);
	});

	socket.on("clear", async (roomid) => {
		io.to(roomid).emit("clear");
	});

	// socket.on("disconnect", () => {
	// 	const user = users.find((u) => u.id == socket.id);
	// 	if(!user) {
	// 		return;
	// 	}

	// 	const roomIndex = rooms.findIndex((r) => r.id == user.roomId);
	// 	const room = rooms[roomIndex];
	// 	const userIndex = room.users.findIndex((u) => u.id == socket.id);

	// 	// if(userIndex == room.turnUserIndex) {
	// 	// 	rooms[roomIndex].turnUserIndex = getNextTurnUserIndex(room);
	// 	// }

	// 	rooms[roomIndex].users.splice(userIndex, 1);
	// 	users.splice(
	// 		users.findIndex((u) => u.ic == socket.id),
	// 		1
	// 	);

	// 	// if (room.turnUserIndex > userIndex) {
	// 	// 	rooms[roomIndex].turnUserIndex--;
	// 	// }

	// 	// io.in(room.id).emit(
	// 	// 	"notifyDisconnection",
	// 	// 	user.name,
	// 	// 	room.usres[rooms[roomIndex].turnUserIndex].name
	// 	// );
	// 	io.in(room.id).emit(
	// 		"notifyDisconnection",
	// 		user.name,
	// 		// room.usres[rooms[roomIndex].turnUserIndex].name
	// 	);
	// });


	socket.on("roomcreate", async (roomid) => {
		const room = {id: roomid, users: [], posts: []}
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) { return }
		else {
			rooms.push(room);
			// key : roomid , val : roomname
			redis_data_setter(0, roomid, "test")
		}
	});

	socket.on("joinroom", async (roomid, name) => {
		const user = { id: socket.id, roomid: roomid, name: name };
		users.push(user);
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		var room = rooms[roomIndex];

		console.log(name)
		room.users.push(user)
		socket.join(roomid);

		notify(roomid, name + "部屋に参加しました")
	});

	socket.on("namech", async (roomid, name) => {
		// const user = { id: socket.id, roomid: roomid, name: name };
		// users.push(user);
		console.log("namech");
		console.log("roomid  " + roomid)

		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if( roomIndex == -1) return;

		console.log("roominuser")

		const userIndex = rooms[roomIndex].users.findIndex((u) => u.id == socket.id);
		if (userIndex != -1) {
			rooms[roomIndex].users[userIndex].name = name;
			io.to(rooms[roomIndex].id).emit("roominuser", rooms[roomIndex].users);
			console.log(rooms[roomIndex].users)
		 }

		 notify(roomid, "名前を変更")
	});

	

	socket.on("roomview", async () => {
		io.to(socket.id).emit("roomview", rooms);
	});
	
	socket.on("roominuser", async (roomid) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) {
			io.to(rooms[roomIndex].id).emit("roominuser", rooms[roomIndex].users);
			console.log(rooms[roomIndex].users);
			var keys = await redis_data_get_allkey(0);
			console.log(keys)
		}
		else { io.to(socket.id).emit("err", "見つかりませんでした"); }
	});

	socket.on("viewposts", async (roomid) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) { io.to(rooms[roomIndex].id).emit("viewposts", rooms[roomIndex].posts); console.log(rooms[roomIndex].posts)}
		else { io.to(socket.id).emit("err", "見つかりませんでした"); }
	});

	socket.on("sendposts", async (roomid, name, post, color) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) {
			var postdata = { "name" : name, "post": post,"color": color};

			console.log(postdata); rooms[roomIndex].posts.push(postdata);
			io.to(rooms[roomIndex].id).emit("viewpost", postdata);

			notify(roomid, "メッセージを取得")
		}
		else { io.to(socket.id).emit("err", "見つかりませんでした"); }
	});
});

function notify(roomid, data) {
	var notidata = {data: data, flag: false}
	io.to(roomid).emit("notify", notidata);
}




async function redis_connection(dbnum)
{
	// console.log("--- redis connect ---");
	const client = redis.createClient();
	await client.connect();
	client.select(dbnum)
	return client;
}

async function redis_disconnection(client)
{
	await client.disconnect();
	// console.error("--- redis disconnect ---");
	// console.log();
}

async function redis_get_values(client, key)
{
	var val = await client.get(key);
	return val;
}

async function redis_set_values(client ,key, val)
{
	await client.set(key, val);
	console.log("set key : " + key + " / val : " + val);
}


async function redis_data_get_allkey(dbnum)
{
	var client = await redis_connection(dbnum);

	const keys = await client.keys('*');
	// console.log("keys.length = " + keys.length);

	await redis_disconnection(client);

	return keys;
}

async function redis_data_getter(dbnum, keys)
{
	var client = await redis_connection(dbnum);
	var temp = [];
	for(let key of keys) temp.push(await redis_get_values(client, key));
	const val = (await Promise.all(temp))

	await redis_disconnection(client);
	return val;
}

async function redis_data_setter(dbnum, key, val)
{
	var client = await redis_connection(dbnum);

	await redis_set_values(client, key, val);

	await redis_disconnection(client);
}


async function redis_data_getter_key_val_map(dbnum, keys)
{
	var client = await redis_connection(dbnum);
	const key_val_map = new Map();

	for(let key of keys)
	{
		var val = await redis_get_values(client, key);
		key_val_map.set(key ,val);
	}

	await redis_disconnection(client);

	return key_val_map;
}
