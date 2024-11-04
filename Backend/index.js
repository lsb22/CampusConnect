const express = require("express");
const cors = require("cors");

const app = express();

const server = require("http").createServer(app);

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("user connected!!!");
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
