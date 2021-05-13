import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as socketio from "socket.io";
import dotenv from "dotenv";
import http from "http";
import { addUser, removeUser, getUserInRoom } from "./users.js";
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(morgan("dev"));
const server = http.createServer(app);

const io = new socketio.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("server is running");
});
io.on("connection", (socket) => {
  console.log("user connected successfully");
  socket.on("join", ({ name, room }, callback) => {
    console.log("Name", name);
    const { error, user } = addUser({ id: socket.id, name, room });
    // console.log("User",user)
    if (error) {
      return callback(error);
    }
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined` });
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });
});

server.listen(PORT, () => {
  console.log("port connected successfully", PORT);
});
