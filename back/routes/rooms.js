const express = require('express');
const router = express.Router()
// TODO: add rest of the necassary imports
const User = require('../model/user');
const Room = require('../model/room');

module.exports = router;

// temporary rooms
rooms = ["room1", "room2", "room3"]

//Get all the rooms
router.get('/all', async (req, res) => {
    // TODO: you have to check the database to only return the rooms that the user is in
    const {session} = req;
    const user = await User.findOne({ username: session.username });
    const rooms = user.rooms; 
    res.send(rooms);
});


router.post('/create', async (req, res) => {
    const {username} = req.session;
    const {roomId} = req.body;
    const room = new Room ({ name: roomId });

    try{
        const dataSaved = await room.save();
        const dataUpdated = await User.findOneAndUpdate({ username }, {$push: {rooms: roomId}}, { new: true });
        console.log(dataSaved, dataUpdated);
        return res.json({msg: 'success', rooms: dataUpdated.rooms});
        // return res.redirect('/');
    }
    catch (error){
        console.log(error);
        res.send({msg: "An error occurred while making the room"});
        // Room already exists
        // User not found
        // User not updated
    }
});


router.post('/join', async (req, res) => {
    // TODO: write necessary codes to join a new room
    const {username} = req.session;
    const {roomId} = req.body;
    try{
        const room = await Room.findOne({ name: roomId });
        if (!room){
            return res.json({msg: 'room does not exist'});
        }
        const dataUpdated = await User.findOneAndUpdate({ username }, {$push: {rooms: roomId}}, { new: true });
        console.log("test");
        return res.json({msg: 'success', rooms: dataUpdated.rooms});
    }
    catch (error){
        console.log(error);
        res.send({msg: 'An error occurred while making the room'});
        // Room already exists
        // User not found
        // User not updated
    }

});

router.post('/enter', async (req, res) => {
    const { session } = req;
    const { name } = req.body;

    // check if user in database
    const room = await Room.findOne({ name });
    
    if (!room)
      return res.json({ msg: "No room found."});
    else {
      session.room = name;
      res.json({ msg: "Chatroom entered", room: name });
    }
})

router.delete('/leave', (req, res) => {
    // TODO: write necessary codes to delete a room
    const {username, roomId} = req.body;
    try{
        const room = Room.findOne({ name: roomId });
        const dataUpdated = User.findOne({ username }, {$pull: {rooms: roomId}}, { new: true });
        return res.json({msg: 'success', room: room, user: dataUpdated});
    }
    catch (error){
        console.log(error);
        res.send({msg: 'An error occurred while making the room'});
        // Room already exists
        // User not found
        // User not updated
    }
});