# CS110 Messenger App

CS110 Messenger App is a real-time, full-stack web messaging application that allows users to communicate instantly. This application uses a suite of modern technologies including React, CSS3, JavaScript, Express.js, NodeJS, Nodemon, and MongoDB.

## Application Stack

This application is built with the following technologies:

- **Frontend**: React, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Real-time Engine**: Socket.io
- **Database**: MongoDB
- **Development Tools**: Visual Studio Code, Nodemon

## Installation Guide

The CS110 Messenger App consists of a frontend and a backend, each of which needs to be installed separately. Follow these steps:

### Backend Installation:

```bash
git clone https://github.com/UCR-CS110-S23/project-super-chess
cd project-super-chess/back
npm install
```

### Frontend Installation:

```bash
cd ../front
npm install
```

## Configuration Guide

Before running the application, you need to set the following environment variables in the backend:

- `MONGO_URL`: Your MongoDB connection string.
- `PORT`: The port number where your backend server will run.
- `SESSION_SECRET`: A secret key for session.

These can be set in a `.env` file in the backend directory.

## Running CS110 Messenger App

To use the CS110 Messenger App, you need to start both the frontend and the backend servers.

### Starting the Backend Server:

```bash
cd back
npm start
```

### Starting the Frontend Server:

```bash
cd ../front
npm start
```

After both servers are running, open your web browser and navigate to `http://localhost:3000`.

## UI/UX Design Overview

Our design approach was focused on creating an intuitive and aesthetically pleasing interface that offers a seamless experience to users. 

### Registration and Login

<table>
  <tr>
    <td>
        <img src="https://github.com/UCR-CS110-S23/project-super-chess/assets/49822431/b27fb109-ba61-40d4-af5b-e13aa5057014" alt="image 1">
    </td>
    <td>
        <img src="https://github.com/UCR-CS110-S23/project-super-chess/assets/49822431/05335204-2b52-4a38-85f3-36caee247cb8" alt="image 2">
    </td>
  </tr>
</table>

<!-- ### Chatroom Lobby


### Chatroom -->

