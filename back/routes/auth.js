const express = require("express");
const User = require("../model/user");
const router = express.Router();

module.exports = router;

router.post("/login", async (req, res) => {
  const { session } = req;
  const { username, password } = req.body;

  // check if user in database
  const user = await User.findOne({ username });

  if (!user) return res.json({ msg: "Incorrect Username ", status: false });
  else if (user.password !== password)
    return res.json({ msg: "Incorrect Password", status: false });
  else {
    session.authenticated = true;
    session.username = username;
    res.json({ msg: "Logged in", username: username, status: true });
  }
});

// DONE: Add login functionality
router.post("/signup", async (req, res) => {
  const { username, password, name } = req.body;
  const user = new User({
    username: username,
    password: password,
    name: name,
  });

  try {
    const dataSaved = await user.save();
    res.status(200).json(dataSaved);
  } catch (error) {
    console.log(error);
    res.send("ERROR!");
  }
});

router.get("/current-username", (req, res) => {
  if (req.session.authenticated) {
    res.json({ username: req.session.username, status: true });
  } else {
    res.json({ msg: "Not authenticated", status: false });
  }
});

//Add change option
router.put("/change-username", async (req, res) => {
  const { session } = req;
  const { currentUsername, newUsername, password } = req.body;

  try {
    if (!session.authenticated || session.username !== currentUsername) {
      res
        .status(401)
        .json({
          msg: "User is not logged in or username doesn't match",
          status: false,
        });
      return;
    }

    const user = await User.findOne({ username: currentUsername });

    if (!user) {
      res.status(404).json({ msg: "User not found", status: false });
      return;
    }

    if (user.password !== password) {
      res.status(403).json({ msg: "Incorrect password", status: false });
      return;
    }

    const existingUser = await User.findOne({ username: newUsername });

    if (existingUser) {
      res.status(409).json({ msg: "Username already taken", status: false });
      return;
    }

    user.username = newUsername;
    const updatedUser = await user.save();

    session.username = newUsername;

    res.json({
      msg: "Username updated successfully",
      username: newUsername,
      status: true,
    });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ msg: "Failed to update username", status: false });
  }
});

// Set up a route for the logout page
router.get("/logout", (req, res) => {
  // Clear the session data and redirect to the home page
  req.session.destroy();
  res.send({ msg: "Logged out", status: true });
});
