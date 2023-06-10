import React from "react";
import { io } from "socket.io-client";

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
    };
  }

  createEntry = (msg) => {
    const usr = msg.sender.name;
    const txt = msg.message.text;
    const isEditing = this.state.editingMessageId === msg._id;

    return (
      <li
        key={msg._id}
        className="chat-message"
        onMouseEnter={() => this.setState({ hover: msg._id })}
        onMouseLeave={() => this.setState({ hover: null })}
      >
        <div>
          <img src={msg.sender.profilePicture} alt="" />
          {usr}
        </div>
        <div>
          {isEditing ? (
            <form onSubmit={this.handleEditSubmit}>
              <input
                type="text"
                value={this.state.editText}
                onChange={this.handleEditTextChange}
              />
              <button type="submit">Submit edit</button>
            </form>
          ) : (
            <span>
              {txt}
              <div
                className="message-actions"
                style={{
                  display: this.state.hover === msg._id ? "block" : "none",
                }}
              >
                <button onClick={() => this.startEditing(msg)}>Edit</button>
                <button onClick={() => this.deleteMessage(msg._id)}>
                  Delete
                </button>
                {/* <button onClick={() => this.addReaction(msg._id, "like")}>
                  Like
                </button>
                <button onClick={() => this.addReaction(msg._id, "dislike")}>
                  Dislike
                </button> */}
              </div>
            </span>
          )}
        </div>
      </li>
    );
  };

  startEditing = (msg) => {
    this.setState({ editingMessageId: msg._id, editText: msg.message.text });
  };

  handleEditTextChange = (event) => {
    this.setState({ editText: event.target.value });
  };

  handleEditSubmit = (event) => {
    event.preventDefault();

    // emit edit event with new message text and id
    this.socket.emit("edit message", {
      id: this.state.editingMessageId,
      newText: this.state.editText,
    });

    // reset editing state
    this.setState({ editingMessageId: null, editText: "" });
  };

  deleteMessage = (id) => {
    // emit delete event with message id
    this.socket.emit("delete message", { id: id });
  };

  addReaction = (id, type) => {
    this.socket.emit("add reaction", { id: id, type: type });
  };

  sendMessage = (msg) => {
    this.socket.emit("chat message", { msg: msg });
  };

  componentDidMount() {
    // If chat history has been updated
    this.socket.on("chat message", (messages) => {
      this.setState({ messages });
    });
  }

  componentWillUnmount() {
    // Clean up socket connection
    this.socket.off("chat message");
  }

  render() {
    return (
      <div>
        <h1>{this.props.room}</h1>
        <ul>
          {this.state.messages.map((m) => {
            return this.createEntry(m);
          })}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const message = e.target.message.value;
            this.sendMessage(message);
            e.target.message.value = ""; // Clear the input field after sending
          }}
        >
          <input type="text" name="message" />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default Chatroom;
