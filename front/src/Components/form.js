import React from "react";
import {
  Button,
  TextField,
  Avatar,
  Typography,
  Container,
  Box,
  // Link,
  // Grid,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./style.css";

const theme = createTheme();

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      showPassword: false,
    };
  }

  handleChange = (event, field) => {
    const { data } = this.state;
    data[field] = event.target.value;
    this.setState({ data });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await this.props.submit(this.state.data);
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {this.props.type.charAt(0).toUpperCase() +
                this.props.type.slice(1)}
            </Typography>
            <Box
              component="form"
              onSubmit={this.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {this.props.fields.map((field, index) => {
                return (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    key={"auth" + field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    autoComplete={field}
                    autoFocus={index === 0}
                    type={field === "password" ? "password" : "text"}
                    onChange={(event) => this.handleChange(event, field)}
                  />
                );
              })}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {this.props.type.charAt(0).toUpperCase() +
                  this.props.type.slice(1)}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default Form;
