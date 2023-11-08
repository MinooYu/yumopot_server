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

const io = require("socket.io")(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

io.on("connection", async (socket) => {
	connectedcnt ++;
	socket.join('room');

	socket.on("helloroom", async () => {
		const user = { id: socket.id };
		users.push(user);

		io.to('room').emit("hello", 'helllooooo!!', connectedcnt);
	});

	socket.on("paint", async (x, y) => {
		io.to('room').emit("paint", x, y);
	});

	socket.on("dragStart", async (x, y) => {
		io.to('room').emit("dragStart", x, y);
	});

	socket.on("dragEnd", async () => {
		io.to('room').emit("dragEnd");
	});

	socket.on("colorch", async (colorstr) => {
		io.to('room').emit("colorch", colorstr);
	});

	socket.on("clear", async () => {
		io.to('room').emit("clear");
	});

	socket.on("roomcreate", async (roomid) => {
		const room = {id: roomid, users: []}
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) {rooms[roomIndex].users.push(socket.id)}
		else { room.users.push(socket.id); rooms.push(room); }
	});

	socket.on("roomview", async () => {
		io.to(socket.id).emit("roomview", rooms);
	});
	
	socket.on("joinroom", async (roomId) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomId);
		var room = rooms[roomIndex];
		room.users.push(socket.id)
	});
	
});
