const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// const multer = require("multer");
// const path = require("path");

const app = express();
const server = http.createServer(app);

const User = require("./model/user");
const Room = require("./model/room");
const Messages = require("./model/messages");
// const Reactions = require("./model/reaction");

// DONE: add cors to allow cross-origin requests
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});
app.use(cors({ origin: "https://cs110messengerapp.herokuapp.com/", credentials: true }));

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database
// DONE: your code here
mongoose.connect(process.env.MONGO_URL);
const database = mongoose.connection;
database.on("error", (error) => console.error(error));
database.once("open", () => console.log("Connected to Database"));

// Set up the session
// DONE: your code here
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
});
app.use(sessionMiddleware);

const routes = require("./routes/auth");
const rooms = require("./routes/rooms");

app.get("/", (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({ message: "logged in" });
  } else {
    console.log("not logged in");
    res.json({ message: "not logged" });
  }
});

app.use("/api/auth/", routes);

// Checking the session before accessing the rooms
app.use((req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});
app.use("/api/rooms/", rooms);

// Profile picture upload configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // Profile picture upload route
// app.post(
//   "/api/auth/profile/picture",
//   upload.single("avatar"),
//   async (req, res) => {
//     if (!req.session || !req.session.authenticated) {
//       return res.status(401).send("Unauthorized");
//     }

//     const user = await User.findById(req.session.userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     if (req.file) {
//       user.avatar = `/uploads/${req.file.filename}`;
//       await user.save();
//     }

//     res.send(user);
//   }
// );

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

// Make sure that the user is logged in before connecting to the socket
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.use((socket, next) => {
  // Check if the user is authenticated
  if (socket.request.session && socket.request.session.authenticated) {
    next();
  } else {
    console.log("Unauthorized");
    next(new Error("Unauthorized"));
  }
});

io.on("connection", async (socket) => {
  console.log("User connected");

  let room = socket.request.session.room;
  let username = socket.request.session.username;
  let history = undefined;
  console.log("User Connected");

  sendHistory = async () => {
    // Get all messages in the room ordered by creation date
    const rm = await Room.findOne({ name: room });
    const filter = { room: rm._id };
    const projection = { message: 1, sender: 1 };
    const options = { sort: { createdAt: 1 }, populate: "sender" };
    history = await Messages.find(filter, projection, options);
    console.log("History:", history);

    io.to(room).emit("chat message", history);
  };
  sendHistory();
  socket.join(room);

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

  // If new message, update all sockets in the room
  socket.on("chat message", async (data) => {
    console.log("Got the message:", data.msg);
    const sender = await User.findOne({ username });
    const txt = data.msg;
    const rm = await Room.findOne({ name: room });
    const m = new Messages({
      message: { text: txt },
      sender: sender._id,
      room: rm._id,
      thumbsUp: 0,
      thumbsDown: 0,
    });

    // Save the message to the database
    try {
      const dataSaved = await m.save();
      console.log("Message saved successfully:", dataSaved);
    } catch (error) {
      console.error("Error while saving message:", error);
    }

    sendHistory(); // Update history display
  });

  // Add an event handler for the "edit message" event
  socket.on("edit message", async ({ id, newText }) => {
    try {
      // Update the message in the database
      await Messages.findByIdAndUpdate(id, { "message.text": newText });
      // Send updated messages to clients
      sendHistory();
    } catch (error) {
      console.error("Error while editing message:", error);
    }
  });

  // Add an event handler for the "delete message" event
  socket.on("delete message", async ({ id }) => {
    try {
      // Delete the message from the database
      await Messages.findByIdAndDelete(id);
      // Send updated messages to clients
      sendHistory();
    } catch (error) {
      console.error("Error while deleting message:", error);
    }
  });

  socket.on("thumbs up", async (data) => {
    try {
      const message = await Messages.findById(data.messageId);
      message.thumbsUp += 1;
      await message.save();
      sendHistory(); // Update history display
    } catch (error) {
      console.error("Error while updating thumbs up count:", error);
    }
  });

  socket.on("thumbs down", async (data) => {
    try {
      const message = await Messages.findById(data.messageId);
      message.thumbsDown += 1;
      await message.save();
      sendHistory(); // Update history display
    } catch (error) {
      console.error("Error while updating thumbs down count:", error);
    }
  });
});
