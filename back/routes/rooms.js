const express = require("express");
const router = express.Router();
// TODO: add rest of the necassary imports
const User = require("../model/user");
const Room = require("../model/room");
const Message = require("../model/messages");

module.exports = router;

// temporary rooms
rooms = ["room1", "room2", "room3"];

//Get all the rooms
router.get("/all", async (req, res) => {
  // TODO: you have to check the database to only return the rooms that the user is in
  const { session } = req;
  const user = await User.findOne({ username: session.username });
  const rooms = user.rooms;
  res.send(rooms);
});

router.post("/create", async (req, res) => {
  const { username } = req.session;
  const { roomId } = req.body;
  const room = new Room({ name: roomId });

  try {
    const dataSaved = await room.save();
    const dataUpdated = await User.findOneAndUpdate(
      { username },
      { $push: { rooms: roomId } },
      { new: true }
    );
    console.log(dataSaved, dataUpdated);
    return res.json({ msg: "success", rooms: dataUpdated.rooms });
    // return res.redirect('/');
  } catch (error) {
    console.log(error);
    res.send({ msg: "An error occurred while making the room" });
    // Room already exists
    // User not found
    // User not updated
  }
});

router.post("/join", async (req, res) => {
  // TODO: write necessary codes to join a new room
  const { username } = req.session;
  const { roomId } = req.body;
  try {
    const room = await Room.findOne({ name: roomId });
    if (!room) {
      return res.json({ msg: "room does not exist" });
    }
    const dataUpdated = await User.findOneAndUpdate(
      { username },
      { $push: { rooms: roomId } },
      { new: true }
    );
    console.log("test");
    return res.json({ msg: "success", rooms: dataUpdated.rooms });
  } catch (error) {
    console.log(error);
    res.send({ msg: "An error occurred while making the room" });
    // Room already exists
    // User not found
    // User not updated
  }
});

router.post("/enter", async (req, res) => {
  const { session } = req;
  const { name } = req.body;

  // check if user in database
  const room = await Room.findOne({ name });

  if (!room) return res.json({ msg: "No room found." });
  else {
    session.room = name;
    res.json({ msg: "Chatroom entered", room: name });
  }
});

router.delete("/leave", (req, res) => {
  // TODO: write necessary codes to delete a room
  const { username, roomId } = req.body;
  try {
    const room = Room.findOne({ name: roomId });
    const dataUpdated = User.findOne(
      { username },
      { $pull: { rooms: roomId } },
      { new: true }
    );
    return res.json({ msg: "success", room: room, user: dataUpdated });
  } catch (error) {
    console.log(error);
    res.send({ msg: "An error occurred while making the room" });
    // Room already exists
    // User not found
    // User not updated
  }
});

router.delete("/message/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Message.findByIdAndDelete(id);
    res.json({ msg: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

router.put("/message/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const message = await Message.findByIdAndUpdate(
      id,
      { "message.text": text },
      { new: true }
    );

    if (!message) {
      res.status(404).json({ error: "Message not found" });
    } else {
      res.json({ msg: "Message updated successfully", message });
    }
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Failed to update message" });
  }
});

// router.put("/message/:id/thumbup", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const message = await Message.findById(id);
//     if (!message) {
//       res.status(404).json({ error: "Message not found" });
//     } else {
//       message.thumbUp += 1; // increment the thumb up counter
//       await message.save();
//       res.json({ msg: "Thumb up counter updated successfully", message });
//     }
//   } catch (error) {
//     console.error("Error updating thumb up counter:", error);
//     res.status(500).json({ error: "Failed to update thumb up counter" });
//   }
// });

// router.put("/message/:id/thumbdown", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const message = await Message.findById(id);
//     if (!message) {
//       res.status(404).json({ error: "Message not found" });
//     } else {
//       message.thumbDown += 1; // increment the thumb down counter
//       await message.save();
//       res.json({ msg: "Thumb down counter updated successfully", message });
//     }
//   } catch (error) {
//     console.error("Error updating thumb down counter:", error);
//     res.status(500).json({ error: "Failed to update thumb down counter" });
//   }
// });
