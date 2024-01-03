import React, { useState } from "react";
import Box from "@mui/material/Box";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ImageIcon from "@mui/icons-material/Image";
import Tooltip from "@mui/material/Tooltip";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { ChatState } from "../../Context/chatProvider";
import ProfileModal from "./ProfileModal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import UserListItem from "./UserListItem";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarType, setSnackBarType] = useState("warning");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      setSnackBarType("warning");
      setOpenSnackBar(true);
      setSnackBarMessage("Search Cannot be Empty");
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      console.log(searchResult);
    } catch (e) {
      setSnackBarType("error");
      setOpenSnackBar(true);
      setSnackBarMessage("Failed to Load the Search Results");
      console.log(e);
      return;
    }
  };

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleLogout = (event) => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const accessChat = async (userId) => {
    //console.log(userId);
    //console.log("yeyey");
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      //console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      console.log(error);
      setSnackBarType("error");
      setOpenSnackBar(true);
      setSnackBarMessage("Error Fetching Chat");
      return;
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity={snackBarType}
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          background: "#C0B9DD",
          display: "flex",
          alignItems: "center",
          borderWidth: "5px",
          padding: "5px 10px 5px 10px",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title="Search a User" onClick={toggleDrawer("left", true)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchIcon />
            <span style={{ marginLeft: "5px" }}>Search</span>
          </div>
        </Tooltip>
        <Typography fontSize="35px" fontFamily="Work sans">
          Chat App
        </Typography>
        <div>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar alt={user.name} src={user.pic} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <ProfileModal user={user} profile={"self"} />
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
        <SwipeableDrawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
          onOpen={toggleDrawer("left", true)}
        >
          <Box
            sx={{
              height: "100%",
              width: 300,
              background: "#DED9E2",
            }}
            role="presentation"
            // onClick={toggleDrawer("left", false)}
            onKeyDown={toggleDrawer("left", false)}
          >
            <List
              sx={{
                background: "#DED9E2",
              }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={"Search User"} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </Box>
          <Box
            sx={{}}
            role="presentation"
            // onClick={toggleDrawer("left", false)}
          >
            <List
              sx={{
                background: "#DED9E2",
              }}
            >
              <ListItem>
                {loading ? (
                  <Stack width={210}>
                    <Skeleton sx={{ fontSize: "3rem" }} animation="wave" />
                    <Skeleton sx={{ fontSize: "3rem" }} animation="wave" />
                    <Skeleton sx={{ fontSize: "3rem" }} animation="wave" />
                    <Skeleton sx={{ fontSize: "3rem" }} animation="wave" />
                    <Skeleton sx={{ fontSize: "3rem" }} animation="wave" />
                    <Skeleton sx={{ fontSize: "3rem" }} animation="wave" />
                  </Stack>
                ) : (
                  <List
                    sx={{
                      width: "100%", // Set the width to 100% to fill the available space
                      maxWidth: "100%", // Set the maxWidth to 100% to allow responsiveness
                      margin: "0", // Reset margin to remove unwanted space
                    }}
                  >
                    {searchResult?.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      />
                    ))}
                  </List>
                )}
              </ListItem>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "baseline",
                  padding: "1px",
                  maxWidth: "95%",
                  margin: "0px 5px",
                }}
              >
                <TextField
                  id="standard-basic"
                  label="Search by name or email"
                  variant="standard"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outlined" onClick={handleSearch}>
                  Go
                </Button>
              </ListItem>
            </List>
          </Box>
        </SwipeableDrawer>
      </Box>
    </>
  );
};

export default SideDrawer;
