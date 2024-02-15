import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./Drawers/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/chatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      h={`calc(90%)`} // Set the height to 100% minus 10 pixels (5px top + 5px bottom)
      w={"30%"}
      borderRadius="10px 0 0 10px"
      borderWidth="1px"
      padding={"5px 10px"}
      sx={{
        "@media screen and (max-width: 500px)": {
          width: "100%",
          display: (theme) => (selectedChat ? "none" : "flex"),
          borderRadius: "10px 10px 10px 10px",
        },
      }}
    >
      <Box
        pb={3}
        px={3}
        fontFamily="Work sans"
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        w="100%"
        alignItems="baseline"
        sx={{ justifyContent: "space-between" }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: 0, // Set margin to zero
            padding: 0, // Set padding to zero
          }}
        >
          My Chats
        </span>
        <GroupChatModal style={{ margin: 0, padding: 0 }} />
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        borderRadius="lg"
        overflowY="scroll"
        minWidth={"20vw"}
        sx={{ maxHeight: "90%" }}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                padding={"0px 15px"}
                fontFamily={""}
                borderRadius="10px"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroup
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
