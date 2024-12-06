const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { AllowedStudents } = require("./createUsers.js");
const { usersCollection } = require("./SignedinUsers.js");
const { google } = require("googleapis");

// perspective apikey -> AIzaSyDgw5ddZkX704fvO_XVjajle4NpOVEnRpc

const gapi = "AIzaSyDgw5ddZkX704fvO_XVjajle4NpOVEnRpc";

const app = express();
const server = require("http").createServer(app);

const corsOptions = {
  origin: [
    "https://campus-connect-frontend-beta.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

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
const studentsReg = ["1JS22IS064", "1JS22IS066", "1JS23IS400"];
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

async function AddEligibleStudents() {
  const res = await AllowedStudents.insertMany(
    studentsReg.map((reg) => ({ registrationNumber: reg }))
  );
  console.log(res);
}

DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

function checkText(text) {
  return new Promise((resolve, reject) => {
    google
      .discoverAPI(DISCOVERY_URL)
      .then((client) => {
        const analyzeRequest = {
          comment: {
            text: text,
          },
          requestedAttributes: {
            TOXICITY: {},
          },
        };

        client.comments.analyze(
          {
            key: gapi,
            resource: analyzeRequest,
          },
          (err, response) => {
            if (err) return reject(err);
            // console.log(response);
            const score =
              response.data.attributeScores.TOXICITY.spanScores[0].score.value;
            resolve(score);
          }
        );
      })
      .catch((err) => {
        reject(err);
      });
  });
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

  socket.on("message", async (data) => {
    const res = await checkText(data.text);
    if (res * 100 >= 70.0) {
      socket.emit("blocked", {
        message: "Offensive/rude message",
      });
    } else {
      createMessage(data);
      io.emit("messageResponse", data);
    }
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

app.post("/signup", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ message: "Please Enter the details" });

  const { name, usn, password } = req.body;
  try {
    const userExist = usersCollection.findOne({ usn });
    if (userExist) {
      console.log("user already exist");
      return res.status(201).json({ message: "User already exist" });
    }
    const isAllowed = await AllowedStudents.findOne({
      registrationNumber: usn,
    });
    if (!isAllowed) {
      return res.status(403).json({ message: "Invalid USN." });
    }
    const user = new usersCollection({ name, usn, password });
    await user.save();
    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
