import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ImageIcon from "@mui/icons-material/Image";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Avatar,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  TextField,
  List,
} from "@mui/material";
import { ChatState } from "../../Context/chatProvider";

import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarType, setSnackBarType] = useState("warning");
  const [snackBarPosition, setsnackBarPosition] = useState({
    horizontal: "center",
    vertical: "bottom",
  });
  const SnackBar = (type, message, v, h) => {
    setSnackBarMessage(message);
    setSnackBarType(type);
    setOpenSnackBar(true);
    setsnackBarPosition({ horizontal: "center", vertical: "bottom" });
    if (h && v) {
      setsnackBarPosition({ horizontal: h, vertical: v });
    }
  };
  const { user, chats, setChats } = ChatState();
  const [open, setOpen] = React.useState(false);
  const [groupChatName, setgroupChatName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setsearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const handleOpen = () => setOpen(true);
  const [loading, setloading] = useState();
  const handleClose = () => setOpen(false);

  const handleDelete = (delUser) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id));
  };
  const handleSearch = async (search) => {
    setsearch(search);
    if (!search) {
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setloading(false);
      setSearchResult(data);
    } catch (error) {
      SnackBar("error", "Failed to load Search Results");
      setloading(false);
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      SnackBar("warning", "Please enter all Fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpen(false);
      SnackBar("success", "New Group Chat Created");
    } catch (error) {
      SnackBar("error", "Failed to create GroupChat");
    }
  };
  const addToSelected = (user) => {
    if (selectedUser.includes(user)) {
      SnackBar("warning", "User Already Added", "top", "center");
      return;
    }
    setSelectedUser([...selectedUser, user]);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: snackBarPosition.vertical,
          horizontal: snackBarPosition.horizontal,
        }}
        open={openSnackBar}
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

      <Button
        onClick={() => {
          handleOpen();
        }}
        color="secondary"
      >
        <AddIcon /> Group
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: "400px", padding: "10px" }}>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              marginTop: "0px",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Group
            </Typography>
          </Box>
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Group Name"
              variant="outlined"
              sx={{ mb: "15px", width: "100%" }}
              value={groupChatName}
              onChange={(e) => {
                setgroupChatName(e.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Add people"
              variant="outlined"
              sx={{ mb: "10px", width: "100%" }}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              alignItems: "center",
              flexDirection: "row",
              display: "flex",
            }}
          >
            {selectedUser.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          <Box sx={{ alignItems: "center", display: "flex" }}>
            <List
              sx={{
                width: "100%",
                maxWidth: "100%",
                margin: "0",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <CircularProgress color="secondary" />
                </Box>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      handleFunction={() => addToSelected(user)}
                    />
                  ))
              )}
            </List>
          </Box>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Create Group
          </Button>
        </Box>
      </Modal>
    </>
  );
}
