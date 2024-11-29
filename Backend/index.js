const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const server = require("http").createServer(app);

const corsOptions = {
  origin: "https://campus-connect-frontend-beta.vercel.app",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://campus-connect-frontend-beta.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

let users = [];
const port = process.env.PORT || 3000;

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
  const messages = await messageModel.find().sort({ _id: -1 });
  return messages;
}

io.on("connection", (socket) => {
  let id = socket.id;
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

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
