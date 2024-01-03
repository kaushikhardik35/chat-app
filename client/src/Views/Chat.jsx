import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/chatProvider";
import Container from "@mui/material/Container";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import SideDrawer from "../components/Drawers/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const drawerWidth = 400;
const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setfetchAgain] = useState(false);
  const [spacing, setSpacing] = React.useState(2);
  return (
    <Box style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { md: "row" },
          "@media screen and (max-width: 500px)": {
            flexDirection: "column",
          },
          p: 2,
          m: 1,
          height: "90.5vh",

          borderRadius: 1,
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
        )}
      </Box>
    </Box>
  );
};

export default Chat;
