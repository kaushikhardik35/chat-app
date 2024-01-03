import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Input } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { CloudinaryContext, Image } from "cloudinary-react";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const SignUp = () => {
  const [pic, setpic] = useState("");
  const [show, setShow] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");
    let picture = null;
    if (pic != "") picture = pic;

    console.log(pic);
    if (!firstName || !lastName || !email || !password) {
      setOpenToast(true);
      setLoading(false);
      return;
    }
    try {
      const config = {
        "Content-Type": "application/json", // Correct property name
      };
      const userData = {
        firstName,
        lastName,
        email,
        password,
        picture,
      };
      const response = await axios.post("/api/user/register", userData, config);

      // Assuming the server responds with user data
      const { data } = response;

      // Save user data to localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Navigate to '/chats'
      navigate("/chats");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);

    //console.log(data.get("pic"));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const postDetails = async (file) => {
    console.log(file);
    setLoading(true);
    if (file == undefined) {
      setOpen(true);
      setpic("");
      return;
    }
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/kaushikhardik35/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setpic(data.secure_url);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setpic("");
      }
    } else {
      setLoading(false);
      setpic("");
      setOpen(true);
    }
  };
  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ mt: 3, maxWidth: "700px" }}
    >
      <Box sx={{ width: "100%" }}>
        <Collapse in={openToast}>
          <Alert
            variant="outlined"
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenToast(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Please Enter All required Fields
          </Alert>
        </Collapse>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type={show ? "password" : "text"}
            id="password"
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            sx={{ marginBottom: "0px" }}
            variant="outlined"
            size="large"
            onClick={() => setShow(!show)}
          >
            {show ? "Show" : "Hide"}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            required
            fullWidth
            name="pic"
            label="Image"
            type="file"
            id="pic"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </Grid>
      </Grid>

      <LoadingButton
        loading={loading}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </LoadingButton>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Please Upload an image
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUp;
