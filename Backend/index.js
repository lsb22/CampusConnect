require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { Readable } = require("stream");
const { google } = require("googleapis");
const { GridFSBucket } = require("mongodb");
const { AllowedStudents } = require("./createUsers.js");
const { usersCollection } = require("./SignedinUsers.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const server = require("http").createServer(app);

// const gapi = process.env.GOOGLE_PERSPECTIVE_API;
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat({
  history: [],
  generationConfig: { maxOutputTokens: 500 },
});

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
  maxHttpBufferSize: 1e7,
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

const connection = mongoose.connection;

let gfsBucket;

connection.once("open", () => {
  gfsBucket = new GridFSBucket(connection.db);
});

const messageSchema = new mongoose.Schema({
  userName: String,
  id: String,
  socketId: String,
  text: String,
  time: Date,
});

const messageModel = mongoose.model("message", messageSchema);

async function createMessage(data) {
  const newMessage = new messageModel(data);
  const res = await newMessage.save();
}

async function getAllFiles() {
  try {
    const cursor = gfsBucket.find({});
    const files = await cursor.toArray();

    if (!files || files.length === 0) return;

    const dataArray = [];

    for (const file of files) {
      const chunks = [];
      const downloadStream = gfsBucket.openDownloadStream(file._id);

      await new Promise((resolve, reject) => {
        downloadStream.on("data", (chunk) => chunks.push(chunk));
        downloadStream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          dataArray.push({
            file: true,
            body: buffer,
            fileName: file.filename,
            mimeType: file.contentType,
            userName: file.metadata.userName,
            socketId: file.metadata.socketId,
            id: file.metadata.id,
            time: file.metadata.time,
          });
          resolve();
        });
        downloadStream.on("error", (err) => reject(err));
      });
    }

    return dataArray;
  } catch (error) {
    console.log("error while retriving files");
  }
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

const DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

// function checkText(text) { // --> for perspective api
//   return new Promise((resolve, reject) => {
//     google
//       .discoverAPI(DISCOVERY_URL)
//       .then((client) => {
//         const analyzeRequest = {
//           comment: {
//             text: text,
//           },
//           requestedAttributes: {
//             TOXICITY: {},
//           },
//         };

//         client.comments.analyze(
//           {
//             key: gapi,
//             resource: analyzeRequest,
//           },
//           (err, response) => {
//             if (err) return reject(err);
//             const score =
//               response.data.attributeScores.TOXICITY.spanScores[0].score.value;
//             resolve(score);
//           }
//         );
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// }

async function callModelToCheckText(input) {
  const res = await chat.sendMessage(input);
  const response = await res.response;
  const text = await response.text();
  return text;
}

io.on("connection", (socket) => {
  let id = socket.id;
  console.log(`user ${id} connected!!!`);

  socket.on("newUser", ({ username }) => {
    users.push({ username, id });
    getAllFiles()
      .then((res) => {
        socket.emit("prevMessages", res);
      })
      .catch((err) => console.log(err));

    fetchMessages()
      .then((res) => {
        socket.emit("prevMessages", res);
      })
      .catch((err) => console.log(err));
    io.emit("newUserLogin", users);
  });

  socket.on("message", async (data) => {
    let res = 0;
    if (!data.file) {
      // res = await checkText(data.text); // --> for perspective api
      const mess =
        "Rate the given text based on toxicity from 1 to 100. Just return the score. Text: " +
        data.text;
      const val = await callModelToCheckText(mess);
      res = parseInt(val);
    }
    if (res * 100 >= 70.0) {
      socket.emit("blocked", {
        message: "Offensive/rude message",
      });
    } else {
      if (!data.file) createMessage(data);
      else {
        if (!gfsBucket) return;
        const readable = new Readable();
        readable.push(data.body);
        readable.push(null);

        const metadata = {
          file: true,
          userName: data.userName,
          socketId: data.socketId,
          id: data.id,
          time: data.time,
        };

        const uploadStream = gfsBucket.openUploadStream(data.fileName, {
          contentType: data.mimeType,
          metadata: metadata,
        });

        readable
          .pipe(uploadStream)
          .on("error", (err) => console.log("Failed to upload", err))
          .on("finish", () =>
            console.log("File uploaded successfully to database")
          );
      }
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
