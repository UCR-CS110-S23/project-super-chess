
const express = require("express");
const socketIO = require('socket.io');
const http = require('http');
const cors  = require("cors");
const session = require('express-session');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require( 'body-parser');

const app = express(); 
const server = http.createServer(app);


const User = require('./model/user');
const Room = require('./model/room');
const Messages = require('./model/messages');



// DONE: add cors to allow cross origin requests
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});
app.use(cors( {origin: ' http://localhost:3000', credentials: true}))



dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Connect to the database
// DONE: your code here
mongoose. connect (process.env.MONGO_URL);
const database = mongoose.connection;
database.on('error', (error) => console.error(error));
database.once('open', () => console.log('Connected to Database'));



// Set up the session
// DONE: your code here
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
})
app.use(sessionMiddleware) ;



const routes = require('./routes/auth');
const rooms = require('./routes/rooms');


app.get('/', (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({ message: "logged in" });
  }
  else {  
    console.log("not logged in")
    res.json({ message: "not logged" });
  }
});


app.use("/api/auth/", routes);


// checking the session before accessing the rooms
app.use((req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});
app.use("/api/rooms/", rooms);



// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});


// DONE: make sure that the user is logged in before connecting to the socket
// DONE: your code here
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.use((socket, next) => {
  // check if the user is authenticated
  if (socket.request.session && socket.request.session.authenticated) {
    next();
  } else {
    console.log("unauthorized")
    next(new Error('unauthorized'));
  }
});

io.on('connection', async (socket)=>{
  console.log("user connected")
  // TODO: write codes for the messaging functionality
  // TODO: your code here 

  let room = socket.request.session.room;
  let username = socket.request.session.username;
  let history = undefined;
  console.log("user Connected");

  sendHistory = async ()=>{
      // Get all messages in room order by creation date
      const rm = await Room.findOne({name: room});
      const filter = {'room': rm._id};
      const projection = {message: 1, sender: 1}
      const options = {sort: {createdAt:1}, 
        populate: 'sender'}
      history = await Messages.find(filter, projection, options);
      console.log("hi")
      
      // history = [...history, data];
      io.to(room).emit("chat message", history);
      // return history;
  }
  sendHistory();
  socket.join(room); 

  
  socket.on("disconnect", ()=>{
    console.log("user Disconnected");
  });
  
  // Setup room upon joining
  // socket.on("join", async (data) => {
  //     socket.join(data.room);
  //     try{
  //       const rm = await Room.findOne({name: data.room});
  //     }catch{
  //       console.log("no such room found");
  //     }
  //     // room = data.room;
  //     // userName = data.userName;
  //     console.log(`user is joined to room ${data.room}`);
  //     // Send history
  //     sendHistory(room);
  // });

  // If new message, update all sockets of a room
  socket.on("chat message", async (data)=>{
    console.log("got the message", data.msg);
    const sender = await User.findOne({ username });
    const txt = data.msg;
    const rm = await Room.findOne({name: room});
    const m = new Messages ({
      message: {text: txt},
      sender: sender._id,
      room: rm._id,  
    });
    // Save message to database
    try {
      const dataSaved = await m.save();
      console.log('Message saved successfully:', dataSaved);
    } catch (error) {
      console.error('Error while saving message:', error);
    }

    sendHistory(); // Update history display.
  });
  
})