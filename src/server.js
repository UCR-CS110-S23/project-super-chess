const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Define app and server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Fake data storage
const users = [];
const games = [];
const comments = [];

app.use(express.json());

// POST registration request
app.post('/register', (req, res) => {
  // Add user to 'database'
  users.push(req.body);
  res.sendStatus(201);
});

// POST login request
app.post('/login', (req, res) => {
  // Simple check for username and password in 'database'
  const user = users.find(u => u.username === req.body.username && u.password === req.body.password);
  if (user) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// POST new comments
app.post('/comments', (req, res) => {
  // Save new comment to 'database'
  comments.push(req.body);
  res.sendStatus(201);
});

// POST new game
app.post('/games', (req, res) => {
  // Save new game to 'database' and emit event to all clients
  games.push(req.body);
  io.emit('newGame', req.body);
  res.sendStatus(201);
});

// GET User Profile Info
app.get('/profile/:username', (req, res) => {
  // Find user in 'database'
  const user = users.find(u => u.username === req.params.username);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

// GET List of Comments
app.get('/comments/:game', (req, res) => {
  // Find comments for specific game
  const gameComments = comments.filter(c => c.game === req.params.game);
  res.json(gameComments);
});

// GET list of games
app.get('/games/:username', (req, res) => {
  // Find games for specific user
  const userGames = games.filter(g => g.winner_name === req.params.username || g.loser_name === req.params.username);
  res.json(userGames);
});

// GET game
app.get('/game/:gameId', (req, res) => {
  // Find specific game
  const game = games.find(g => g.id === req.params.gameId);
  if (game) {
    res.json(game);
  } else {
    res.sendStatus(404);
  }
});

// DELETE account
app.delete('/account/:username', (req, res) => {
  // Find and remove user from 'database'
  const index = users.findIndex(u => u.username === req.params.username);
  if (index !== -1) {
    users.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = require('./app');

mongoose
  .connect(process.env.DATABASE, { useUnifiedTopology: true })
  .then(() => console.log('DB connection successful!'));

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
});
server.listen(3000, () => console.log('Server started on port 3000'));