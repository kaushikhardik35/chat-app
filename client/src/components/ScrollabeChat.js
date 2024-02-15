import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import React, { useLayoutEffect, useRef } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";

import { ChatState } from "../Context/chatProvider";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const chatContainerRef = useRef(null);

  useLayoutEffect(() => {
    // Scroll to the bottom when messages change
    chatContainerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <ScrollableFeed key={messages.length}>
      <div
        ref={chatContainerRef}
        style={{
          padding: "10px",
          height: "100%",
          overflowY: "auto",
          borderBottom: "1px solid #ddd",
        }}
      >
        {messages &&
          messages.map((m, i) => (
            <React.Fragment key={m._id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip title={m.sender.name}>
                    <Avatar
                      style={{
                        margin: "0 10px 0 0",
                        cursor: "pointer",
                      }}
                      size="sm"
                      alt={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "10px",
                    maxWidth: "75%",
                  }}
                >
                  {m.content}
                </span>
              </div>
            </React.Fragment>
          ))}
      </div>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
