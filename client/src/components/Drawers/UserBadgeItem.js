import { Avatar, Badge } from "@mui/material";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      color="secondary"
      badgeContent={"X"}
      onClick={handleFunction}
      sx={{
        display: "flex",
        padding: "5px",
        marginRight: "10px",
        flexDirection: "column",
      }}
    >
      <Avatar src={user.pic} />
      <span
        style={{
          maxWidth: "60px",
        }}
      >
        {user.name}
      </span>
    </Badge>
  );
};

export default UserBadgeItem;
