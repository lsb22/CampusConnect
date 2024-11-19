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

// database actions

const connectionString = require("./password.js").str;

mongoose
  .connect(connectionString)
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log(err));

const messageSchema = new mongoose.Schema({
  userName: String,
  id: String,
  socketId: String,
  text: String,
});

const messageModel = mongoose.model("message", messageSchema);

async function createMessage(data) {
  const newMessage = new messageModel(data);
  const res = await newMessage.save();
}

async function fetchMessages() {
  const messages = await messageModel.find().sort({ _id: -1 }).limit(10);
  return messages;
}

io.on("connection", (socket) => {
  const id = socket.id;
  console.log(`user ${id} connected!!!`);

  socket.on("newUser", ({ username }) => {
    users.push({ username, id });
    fetchMessages()
      .then((res) => {
        socket.emit("prevMessages", res);
      })
      .catch((err) => console.log(err));
    io.emit("newUserLogin", users);
  });

  socket.on("message", (data) => {
    createMessage(data);
    io.emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    users = users.filter((user) => user.id !== id);
    io.emit("newUserLogin", users);
  });
});

app.get("/", (req, res) => {
  res.send("welcome to my website");
});

server.listen(3000, () => {
  console.log("server is running on 3000");
});
