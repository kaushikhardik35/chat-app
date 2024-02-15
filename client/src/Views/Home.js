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
import Login from "../components/Auth/login";
import Register from "../components/Auth/signUp";
import { useNavigate } from "react-router-dom";
const defaultTheme = createTheme();
const Home = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" gutterBottom>
            <Paper
              sx={{
                background: "#990D35",
                color: "#FCD581",
                padding: "5px 25px",
                borderRadius: "60px 20px  60px  20px",
              }}
              elevation={12}
            >
              Chat App
            </Paper>
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: "4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            typography: "body1",
          }}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                      </Avatar>
                      <Typography component="h1" variant="h5">
                        Sign in
                      </Typography>
                    </Box>
                  }
                  value="1"
                ></Tab>
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src="https://cdn-icons-png.flaticon.com/512/3456/3456388.png"
                        sx={{ m: 1 }}
                      />
                      <Typography component="h1" variant="h5">
                        Register
                      </Typography>
                    </Box>
                  }
                  value="2"
                ></Tab>
              </TabList>
            </Box>
            <TabPanel value="1">
              <Login />
            </TabPanel>
            <TabPanel value="2">
              <Register />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
