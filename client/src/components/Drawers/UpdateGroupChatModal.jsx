import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setfetchAgain }) => {
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
  const handleClose = () => {
    setOpenSnackBar(false);
  };
  const [open, setOpen] = React.useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      SnackBar("error", "Failed to load Search Reasults");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      SnackBar("error", "Hi");
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      SnackBar("error", "User Already In Group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      SnackBar("error", "Only Admins can Add Someone");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      SnackBar("error", error.response.data.message);
      setLoading(false);
    }
    setGroupChatName("");
  };
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

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      SnackBar("error", "Only Admins can remove someone");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      SnackBar("error", "rrr");
      setLoading(false);
    }
    setGroupChatName("");
  };
  return (
    <Box>
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
          setOpen(true);
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
              Update Group
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Group Name"
                variant="outlined"
                sx={{ mb: "15px", width: "70%" }}
                value={groupChatName}
                onChange={(evt) => setGroupChatName(evt.target.value)}
              />
              <Button
                variant="contained"
                color="success"
                sx={{ width: "20%", mb: "15px" }}
                onClick={() => handleRename(user)}
              >
                Update
              </Button>
            </Box>
            <TextField
              id="outlined-basic"
              label="Add people"
              variant="outlined"
              sx={{ mb: "20px", width: "100%" }}
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
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
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
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
              )}
            </List>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateGroupChatModal;
