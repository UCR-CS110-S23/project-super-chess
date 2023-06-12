import react from "react";
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
const qrcode = require("qrcode");

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

class Auth extends react.Component {
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

  closeForm = () => {
    this.setState({ showForm: false });
  };

  toggleForm = () => {
    const newForm = this.state.selectedForm === "login" ? "register" : "login";
    this.setState({ selectedForm: newForm });
  };

  login = (data) => {
    // DONE: write codes to login
    console.log(data);

    fetch(this.props.server_url + "/api/auth/login", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header above.
    }).then((res) => {
      res.json().then((data) => {
        if (data.msg === "Logged in") {
          // this.props.changeUser(data.username);
          this.props.changeScreen("lobby");
        } else {
          alert(data.msg);
        }
      });
    });
  };

  register = (data) => {
    // DONE: write codes to register
    console.log(data);
    fetch(this.props.server_url + "/api/auth/signup", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header above.
    }).then((res) => {
      res
        .clone()
        .json()
        .then((data) => {
          qrcode.toDataURL(data.otpauth_url, function (err, data) {
            console.log(data);
            document.getElementById("forQRcode").innerHTML =
              '<img src="' +
              data +
              '" alt="QR code"/><br/>Use this QR code for 2FA';
          });
        })
        .catch(() => {
          res.text().then((textData) => {
            alert(textData);
          });
        });
    });
  };

  render() {
    const { showForm, selectedForm, open, message, severity, loading } =
      this.state;

    let display = null;
    if (this.state.showForm) {
      let fields = [];
      if (this.state.selectedForm === "login") {
        fields = ["username", "password", "OneTimePassword"];
        console.log();
        display = (
          <Form
            // sx={{ mt: 10 }}
            fields={fields}
            close={this.closeForm}
            type="Login"
            submit={this.login}
            key={this.state.selectedForm}
          />
        );
      } else if (this.state.selectedForm === "register") {
        fields = ["username", "password", "name"];
        display = (
          <div>
            <Form
              //  sx={{ mb: 10 }}
              fields={fields}
              close={this.closeForm}
              type="Register"
              submit={this.register}
              key={this.state.selectedForm}
            />
            <div id="forQRcode"></div>
          </div>
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
            sx={{ mb: 5 }}
            // anchorOrigin={{ vertical: "top" }}
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
          >
            Messenger
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
