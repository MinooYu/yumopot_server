const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const { log } = require("console");
const { Socket } = require("net");
const app = express();

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
var connectedcnt = 0
const rooms = [];
const minesroom = {id: "mineswiper_room", users: [], posts: []}
rooms.push(minesroom);

const io = require("socket.io")(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

io.on("connection", async (socket) => {
	connectedcnt ++;

	socket.on("joinmineswiper", async () => {
		const user = { id: socket.id };
		users.push(user);
		
		socket.join('mineswiper_room');
		io.to('mineswiper_room').emit("hello", 'helllooooo!!', connectedcnt);
	});

	socket.on("paint", async (x, y) => {
		io.to('mineswiper_room').emit("paint", x, y);
	});

	socket.on("dragStart", async (x, y) => {
		io.to('mineswiper_room').emit("dragStart", x, y);
	});

	socket.on("dragEnd", async () => {
		io.to('mineswiper_room').emit("dragEnd");
	});

	socket.on("colorch", async (colorstr) => {
		io.to('mineswiper_room').emit("colorch", colorstr);
	});

	socket.on("clear", async () => {
		io.to('mineswiper_room').emit("clear");
	});




	socket.on("roomcreate", async (roomid) => {
		const room = {id: roomid, users: [], posts: []}
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) { return }
		else { rooms.push(room); }
	});

	socket.on("roomview", async () => {
		io.to(socket.id).emit("roomview", rooms);
	});
	
	socket.on("joinroom", async (roomid) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		var room = rooms[roomIndex];
		room.users.push(socket.id)
		socket.join(roomid);
	});

	socket.on("viewposts", async (roomid) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) { io.to(rooms[roomIndex].id).emit("viewposts", rooms[roomIndex].posts); console.log(rooms[roomIndex].posts)}
		else { io.to(socket.id).emit("err", "見つかりませんでした"); }
	});

	socket.on("sendposts", async (roomid,name, post) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) { var postdata = { "name" : name, "post": post};rooms[roomIndex].posts.push(postdata); io.to(rooms[roomIndex].id).emit("viewposts", rooms[roomIndex].posts);}
		else { io.to(socket.id).emit("err", "見つかりませんでした"); }
	});
});
