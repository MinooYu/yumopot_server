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

	socket.on("disconnect", () => {
		const user = users.find((u) => u.id == socket.id);
		if(!user) {
			return;
		}

		const roomIndex = rooms.findIndex((r) => r.id == user.roomId);
		const room = rooms[roomIndex];
		const userIndex = room.users.findIndex((u) => u.id == socket.id);

		// if(userIndex == room.turnUserIndex) {
		// 	rooms[roomIndex].turnUserIndex = getNextTurnUserIndex(room);
		// }

		rooms[roomIndex].users.splice(userIndex, 1);
		users.splice(
			users.findIndex((u) => u.ic == socket.id),
			1
		);
		
		// if (room.turnUserIndex > userIndex) {
		// 	rooms[roomIndex].turnUserIndex--;
		// }

		// io.in(room.id).emit(
		// 	"notifyDisconnection",
		// 	user.name,
		// 	room.usres[rooms[roomIndex].turnUserIndex].name
		// );
		io.in(room.id).emit(
			"notifyDisconnection",
			user.name,
			// room.usres[rooms[roomIndex].turnUserIndex].name
		);
	});


	socket.on("roomcreate", async (roomid) => {
		const room = {id: roomid, users: [], posts: []}
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) { return }
		else { rooms.push(room); }
	});

	socket.on("joinroom", async (roomid, name) => {
		const user = { id: socket.id, roomid: roomid, name: name };
		users.push(user);
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		var room = rooms[roomIndex];

		console.log(name)
		room.users.push(user)
		socket.join(roomid);
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
			rooms[roomIndex].users[userIndex].name = name
			io.to(rooms[roomIndex].id).emit("roominuser", rooms[roomIndex].users);
			console.log(rooms[roomIndex].users)
		 }
		
	});

	

	socket.on("roomview", async () => {
		io.to(socket.id).emit("roomview", rooms);
	});
	
	socket.on("roominuser", async (roomid) => {
		const roomIndex = rooms.findIndex((r) => r.id == roomid);
		if(roomIndex != -1) { io.to(rooms[roomIndex].id).emit("roominuser", rooms[roomIndex].users); console.log(rooms[roomIndex].users)}
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
		}
		else { io.to(socket.id).emit("err", "見つかりませんでした"); }
	});
});
