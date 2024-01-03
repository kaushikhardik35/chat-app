import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <ListItem
        onClick={handleFunction}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: "5px 10px",
          maxWidth: "99%",
          backgroundColor: "#F7F4EA",
          marginBottom: "10px",
          borderRadius: "15px",
          "&:hover": {
            backgroundColor: "#C0B9DD", // Set the desired background color on hover
          },
        }}
        key={user._id}
      >
        <ListItemAvatar>
          <Avatar name={user.name} src={user.pic}>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.name} secondary={user.email} />
      </ListItem>
    </>
  );
};

export default UserListItem;
