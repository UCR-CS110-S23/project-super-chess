const express = require('express');
const User = require('../model/user');
const crypto = require("crypto");

const router = express.Router()

module.exports = router;

router.post('/login', async (req, res) => {
    const { session } = req;
    const { username, password } = req.body;

    // check if user in database
    const user = await User.findOne({ username: username }).exec();

    console.log(user);
    let currentHash = crypto.pbkdf2Sync(password,
        user.salt, 1000, 64, `sha512`).toString(`hex`);
    if(currentHash === user.hash){
        session.authenticated = true;
        session.username = username;
        res.json({ msg: "Logged in", username: username, status: true });
    }else {
        return res.json({ msg: "Incorrect Password", status: false });
    }

});

// DONE: Add login functionality
router.post('/signup',  async (req, res)=>{
    const { username, password } = req.body;
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        hash: req.body.password,
        salt: "salt",
    });
    try{
        const dataSaved = await user.save();
        res.status(200).json(dataSaved);
    }
    catch (error){
        console.log(error);
        res.send("ERROR!");
    }
})
//Add change option

// Set up a route for the logout page
router.get('/logout', (req, res) => {
    // Clear the session data and redirect to the home page
    req.session.destroy();
    res.send({msg: "Logged out", status: true})
  });