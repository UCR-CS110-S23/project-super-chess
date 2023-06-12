import react from "react";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

class Lobby extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: undefined,
      openSnackbar: false,
      snackbarSeverity: "info",
      snackbarMessage: "",
      editingUsername: false,
      newUsername: "",
      username: "",
    };
  }

  handleSnackbarClose = () => {
    this.setState({ openSnackbar: false });
  };

  showAlert = (message, severity) => {
    this.setState({
      openSnackbar: true,
      snackbarSeverity: severity,
      snackbarMessage: message,
    });
  };

  componentDidMount() {
    // TODO: write codes to fetch all rooms from server
    fetch(this.props.server_url + "/api/rooms/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        this.setState({ rooms: data });
      });
    });
    this.getCurrentUsername();
  }

  logout = () => {
    fetch(this.props.server_url + "/api/auth/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data.msg === "Logged out") {
          this.props.changeScreen("auth");
        } else {
          this.showAlert(data.msg, "error");
        }
      });
    });
  };

  create = (roomId) => {
    fetch(this.props.server_url + "/api/rooms/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ roomId }),
    }).then((res) => {
      console.log("hi");
      res.json().then((data) => {
        console.log("hi");
        if (data.msg === "success") {
          this.setState({ rooms: data.rooms });
        } else {
          this.showAlert(data.msg, "error");
        }
      });
    });
  };

  join = (roomId) => {
    const existingRoom = this.state.rooms.find((room) => room === roomId);
    if (existingRoom) {
      this.enter(roomId);
    } else {
      fetch(this.props.server_url + "/api/rooms/join", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      }).then((res) => {
        res.json().then((data) => {
          if (data.msg === "success") {
            this.setState({ rooms: data.rooms });
            // alert(data.room.name, data.user.username);
          } else {
            this.showAlert(data.msg, "error");
          }
        });
      });
    }
  };

  enter = (name) => {
    fetch(this.props.server_url + "/api/rooms/enter", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name }), // body data type must match "Content-Type" header above.
    }).then((res) => {
      res.json().then((data) => {
        if (data.msg === "Chatroom entered") {
          console.log(this.props);
          console.log(data.room);
          this.props.changeRoom(data.room);
          this.props.changeScreen("chatroom");
        } else {
          alert(data.msg);
        }
      });
    });
    // alert(roomId);
  };

  startEditingUsername = () => {
    this.setState({ editingUsername: true, newUsername: this.state.username });
  };

  handleNewUsernameChange = (event) => {
    this.setState({ newUsername: event.target.value });
  };

  handleEditSubmit = (event) => {
    event.preventDefault();
    this.changeUsername(this.state.newUsername);
  };

  getCurrentUsername = () => {
    fetch(this.props.server_url + "/api/auth/current-username", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data.status) {
          this.setState({ username: data.username });
        } else {
          this.showAlert(data.msg, "error");
        }
      });
    });
  };

  render() {
    return (
      <div style={containerStyle}>
        <Snackbar
          open={this.state.openSnackbar}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={this.handleSnackbarClose}
            severity={this.state.snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {this.state.snackbarMessage}
          </Alert>
        </Snackbar>
        <Container maxWidth="sm">
          <Box sx={{ my: 4 }}>
            <Typography align="center" variant="h4" component="h1" gutterBottom>
              Lobby
            </Typography>
            {this.state.editingUsername ? (
              <form onSubmit={this.handleNewUsernameChange}>
                <TextField
                  id="change-username"
                  label="New Username"
                  name="newUsername"
                  variant="outlined"
                  fullWidth
                  value={this.state.newUsername}
                  onChange={this.handleNewUsernameChange}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" type="submit" fullWidth>
                    Change Username
                  </Button>
                </Box>
              </form>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography variant="h6">
                  User: {this.state.username}
                </Typography>
                {/* <Button variant="contained" onClick={this.startEditingUsername}>
                  Edit Username
                </Button> */}
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button variant="outlined" onClick={this.logout}>
                Logout
              </Button>
            </Box>
            {this.state.rooms ? (
              <List>
                {this.state.rooms.map((room) => (
                  <ListItem
                    button
                    key={room}
                    onClick={() => this.enter(room)}
                    style={{
                      backgroundColor: "lightgray",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "gray";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "lightgray";
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>Room {room}</span>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const roomId = e.target.roomId.value;
                this.join(roomId);
              }}
            >
              <TextField
                id="join-room-id"
                label="Room ID"
                name="roomId"
                variant="outlined"
                fullWidth
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  sx={{ mb: 2 }}
                  variant="contained"
                  type="submit"
                  fullWidth
                >
                  Join Room
                </Button>
              </Box>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const roomId = e.target.roomId.value;
                this.create(roomId);
              }}
            >
              <TextField
                id="create-room-id"
                label="Room ID"
                name="roomId"
                variant="outlined"
                fullWidth
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" type="submit" fullWidth>
                  Create Room
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </div>
    );
  }
}

export default Lobby;
