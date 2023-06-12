import React from "react";
import Form from "../Components/form.js";
import {
  Button,
  Grid,
  Link,
  Snackbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import Alert from "@mui/material/Alert";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      selectedForm: undefined,
      open: false,
      message: "",
      severity: "success",
      loading: false,
    };
  }

  closeForm = () => {
    this.setState({ showForm: false });
  };

  toggleForm = () => {
    const newForm = this.state.selectedForm === "login" ? "register" : "login";
    this.setState({ selectedForm: newForm });
  };

  login = (data) => {
    console.log(data);
    this.setState({ loading: true }); // Set loading state

    fetch(this.props.server_url + "/api/auth/login", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "Logged in") {
          this.props.changeScreen("lobby");
          this.handleSnackbarOpen("Logged in successfully!", "success");
        } else {
          this.handleSnackbarOpen(data.msg, "error");
        }
      })
      .catch(() => {
        this.handleSnackbarOpen("Network error!", "error");
      })
      .finally(() => {
        this.setState({ loading: false }); // Reset loading state
      });
  };

  register = (data) => {
    console.log(data);
    this.setState({ loading: true }); // Set loading state

    fetch(this.props.server_url + "/api/auth/signup", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.clone().json())
      .then((data) => {
        this.handleSnackbarOpen("Registered successfully!", "success");
      })
      .catch(() => {
        this.handleSnackbarOpen("Network error!", "error");
      })
      .finally(() => {
        this.setState({ loading: false }); // Reset loading state
      });
  };

  handleSnackbarOpen = (message, severity) => {
    this.setState({
      open: true,
      message,
      severity,
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: "",
    });
  };

  render() {
    const { showForm, selectedForm, open, message, severity, loading } =
      this.state;

    let display = null;
    if (showForm) {
      let fields = [];
      if (selectedForm === "login") {
        fields = ["username", "password"];
        display = (
          <Form
            fields={fields}
            close={this.closeForm}
            type="login"
            submit={this.login}
            key={selectedForm}
          />
        );
      } else if (selectedForm === "register") {
        fields = ["username", "password", "name"];
        display = (
          <Form
            fields={fields}
            close={this.closeForm}
            type="register"
            submit={this.register}
            key={selectedForm}
          />
        );
      }
    } else {
      display = (
        <div>
          <Button
            onClick={() =>
              this.setState({ showForm: true, selectedForm: "login" })
            }
            variant="contained"
            size="large"
            sx={{ marginRight: 2 }}
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
          <Button
            onClick={() =>
              this.setState({ showForm: true, selectedForm: "register" })
            }
            variant="outlined"
            size="large"
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </div>
      );
    }

    return (
      <div style={containerStyle}>
        <div className="welcome">
          {open && (
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={this.handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={this.handleSnackbarClose}
                severity={severity}
                sx={{ width: "100%" }}
              >
                {message}
              </Alert>
            </Snackbar>
          )}
          <Typography
            // anchorOrigin={{ vertical: "top" }}
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
          >
            Welcome to our app
          </Typography>
          {display}
          {showForm && (
            <Grid container mt={2}>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={this.toggleForm}
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  {selectedForm === "login"
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    );
  }
}

export default Auth;
