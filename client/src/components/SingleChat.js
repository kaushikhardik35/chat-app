import {
  Box,
  CircularProgress,
  Input,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  Typography,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import ScrollabeChat from "./ScrollabeChat";
import { ChatState } from "../Context/chatProvider";
import Typewriter from "./Drawers/TypeWriter";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import UpdateGroupChatModal from "./Drawers/UpdateGroupChatModal";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Drawers/ProfileModal";
import { SpinnerIcon } from "@chakra-ui/icons";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarType, setSnackBarType] = useState("warning");
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const [snackBarPosition, setsnackBarPosition] = useState({
    horizontal: "center",
    vertical: "bottom",
  });
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

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

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      SnackBar("error", "Failed to load messages");
    }
  };
  const fetchMessages1 = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      //setLoading(false);
    } catch (error) {
      SnackBar("error", "Failed to load messages");
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        fetchMessages1();
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter") {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        setMessages((prevMessages) => [...prevMessages, data]);

        setNewMessage("");
      } catch (e) {
        console.log(e);
        SnackBar("error", "Failed to Send Message");
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <Box sx={{ width: "100%", background: "white", height: "100%" }}>
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

      {
        !selectedChat ? (
          <Box
            sx={{
              width: "100%",
              background: "white",
              height: "100%",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: "bold",
              position: "relative",
              overflow: "hidden",
              animation: "fade 2s infinite", // Apply the fade animation
            }}
          >
            Select a chat to Start
            {/* Add other letters similarly */}
          </Box>
        ) : (
          <Box boxSizing={"border-box"} height={"100%"}>
            <Typography
              variant="body1"
              color="initiall"
              sx={{
                fontSize: { base: "28px", md: "30px" },
                pb: "3px",
                px: "2px",
                width: "100%",
                display: "flex",
                justifyContent: { base: "space-between", md: "space-between" },
                alignItems: "center",
                height: "10%",
                background: "#E8E8E8",
              }}
              boxSizing={"border-box"}
            >
              <Button
                sx={{
                  display: { base: "flex", md: "none" },
                  background: "blue",
                  color: "black",
                  margin: "8px 5px",
                }}
              >
                <KeyboardBackspaceIcon
                  sx={{ display: { base: "flex", md: "none" } }}
                  onClick={() => setSelectedChat("")}
                />
              </Button>
              {!selectedChat.isGroup ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}{" "}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setfetchAgain={setfetchAgain}
                  />
                </>
              )}
            </Typography>
            <Box
              display="flex"
              //margin="10px"
              flexDirection="column"
              justifyContent="flex-end"
              //padding="3px"
              bgcolor="#c0b9dd"
              width={"100%"}
              boxSizing={"border-box"}
              height={"100%"}
              overflow="scroll"
              border="10px solid white" // Added 'solid' to specify the border style
              sx={{ height: "90%" }}
            >
              {loading ? (
                <CircularProgress
                  size={100}
                  color="success"
                  sx={{
                    alignSelf: "center",
                    margin: "auto",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    boxSizing: "border-box",
                    width: "100%",
                    maxWidth: "100%",
                    height: "100%",
                  }}
                  overflow={"hidden"}
                >
                  <Box
                    sx={{
                      overflow: "scroll",
                      height: "90%",
                      boxSizing: "border-box",
                      maxWidth: "100%",
                      backgroundColor: "#ded9e2",

                      //backgroundColor: "red",
                    }}
                  >
                    <div style={{ height: "90%%", overflowY: "auto" }}>
                      <ScrollabeChat messages={messages} />

                      {istyping ? (
                        <div>
                          <Lottie
                            options={defaultOptions}
                            // height={50}
                            width={70}
                            style={{ marginLeft: 0, marginTop: 0 }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Box>
                  <FormControl
                    sx={{
                      height: "10%",
                      width: "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Type Here"
                      id="fullWidth"
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyDown={sendMessage}
                    />
                  </FormControl>
                </Box>
              )}
            </Box>
          </Box>
        )
        /* Render your chat content here when selectedChat is true */
      }
    </Box>
  );
};

export default SingleChat;
