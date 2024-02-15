import * as React from "react";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";

const Login = () => {
  const [show, setShow] = useState(true);
  const [open, setOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (!email || !password) {
      setOpenToast(true);
      setLoading(false);
      return;
    }
    try {
      const config = {
        "Content-Type": "application/json", // Correct property name
      };
      const userData = {
        email,
        password,
      };
      const response = await axios.post("/api/user/login", userData, config);

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

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <LoadingButton
        loading={loading}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </LoadingButton>
    </Box>
  );
};

export default Login;
