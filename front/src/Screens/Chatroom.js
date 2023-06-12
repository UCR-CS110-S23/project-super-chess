import React from "react";
import { io } from "socket.io-client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(this.props.server_url, {
      cors: {
        origin: "http://localhost:3001",
        credentials: true,
      },
      transports: ["websocket"],
    });

    // Client socket properties
    this.state = {
      messages: [],
      editingMessageId: null,
      editText: "",
      reactions: {},
      thumbsCount: {}, // An object to hold thumbs up/down counts for each message
    };
  }

  onEmojiClick = (messageId, reaction) => {
    this.setState((prevState) => ({
      reactions: {
        ...prevState.reactions,
        [messageId]: (prevState.reactions[messageId] || "") + reaction,
      },
    }));
  };

  toggleReactionMenu = (id, reaction) => {
    this.onEmojiClick(id, reaction);
    this.setState((prevState) => {
      const currentCount = prevState.thumbsCount[id] || { up: 0, down: 0 };
      return {
        thumbsCount: {
          ...prevState.thumbsCount,
          [id]: {
            up:
              reaction === "&#x1F44D;" ? currentCount.up + 1 : currentCount.up,
            down:
              reaction === "&#x1F44E;"
                ? currentCount.down + 1
                : currentCount.down,
          },
        },
      };
    });
  };

  handleGoBack = () => {
    this.props.changeScreen("lobby");
  };

  startEditing = (msg) => {
    this.setState({ editingMessageId: msg._id, editText: msg.message.text });
  };

  handleEditTextChange = (event) => {
    this.setState({ editText: event.target.value });
  };

  handleEditSubmit = (event) => {
    event.preventDefault();

    this.socket.emit("edit message", {
      id: this.state.editingMessageId,
      newText: this.state.editText,
    });

    this.setState({ editingMessageId: null, editText: "" });
  };

  deleteMessage = (id) => {
    this.socket.emit("delete message", { id: id });
  };

  addReaction = (id, type) => {
    this.socket.emit("add reaction", { id: id, type: type });
  };

  sendMessage = (msg) => {
    this.socket.emit("chat message", { msg: msg });
  };

  componentDidMount() {
    this.socket.on("chat message", (messages) => {
      this.setState({ messages });
    });
  }

  componentWillUnmount() {
    this.socket.off("chat message");
  }

  createEntry = (msg) => {
    const isEditing = this.state.editingMessageId === msg._id;

    return (
      <ListItem key={msg._id} className="chat-message">
        <Grid container>
          <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
            <Avatar alt={msg.sender.name} src={msg.sender.profilePicture} />
            <Typography variant="body1" style={{ marginLeft: "8px" }}>
              {msg.sender ? msg.sender.name : "Unknown User"}
            </Typography>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <IconButton onClick={() => this.startEditing(msg)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => this.deleteMessage(msg._id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => this.toggleReactionMenu(msg._id, "&#x1F44D;")}
              >
                <Typography>&#x1F44D;</Typography>
              </IconButton>
              <Typography>
                {this.state.thumbsCount[msg._id]?.up || 0}
              </Typography>
              <IconButton
                onClick={() => this.toggleReactionMenu(msg._id, "&#x1F44E;")}
              >
                <Typography>&#x1F44E;</Typography>
              </IconButton>
              <Typography>
                {this.state.thumbsCount[msg._id]?.down || 0}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {isEditing ? (
              <form onSubmit={this.handleEditSubmit}>
                <TextField
                  type="text"
                  value={this.state.editText}
                  onChange={this.handleEditTextChange}
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit edit
                </Button>
              </form>
            ) : (
              <Typography
                sx={{
                  m: 2,
                  align: "left",
                  display: "inline-block",
                  backgroundColor: "lightgray",
                  borderRadius: "10px",
                  padding: "10px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                {msg.message.text}
              </Typography>
            )}
          </Grid>
        </Grid>
      </ListItem>
    );
  };

  render() {
    return (
      <div className="chatroom">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={this.handleGoBack}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Room {this.props.room}</Typography>
          </Toolbar>
        </AppBar>

        <List>
          {this.state.messages.map((m) => {
            return this.createEntry(m);
          })}
        </List>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const message = e.target.message.value;
            this.sendMessage(message);
            e.target.message.value = "";
          }}
        >
          <TextField type="text" name="message" fullWidth sx={{ p: 2 }} />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
      </div>
    );
  }
}

export default Chatroom;
