require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const server = require("http").createServer(app);

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected!!!`);

  socket.on("newUser", (data) => {
    users.push(data);
    io.emit("newUserLogin", users);
  });

  socket.on("message", (data) => {
    io.emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("welcome to my website");
});

server.listen(3000, () => {
  console.log("server is running on 3000");
});

// database actions

const connectionString = require("./password.js").str;

mongoose
  .connect(connectionString)
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log(err));
