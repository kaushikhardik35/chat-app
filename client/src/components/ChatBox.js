import React from "react";
import { Box } from "@mui/material";
import { ChatState } from "../Context/chatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setfetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      height="calc(91.3%)"
      width="70%"
      borderRadius="0px 30px 30px 0px"
      borderWidth="1px"
      padding="0px 10px"
      sx={{
        "@media screen and (max-width: 500px)": {
          width: "90%",
          display: selectedChat ? "flex" : "none",
          borderRadius: "10px", // Set the borderRadius for mobile view
        },
      }}
      overflow="scroll"
    >
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
    </Box>
  );
};

export default ChatBox;
