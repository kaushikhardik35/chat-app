import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Typography,
  Button,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UserProfileModal = ({ user, profile }) => {
  const [open1, setOpen1] = useState(false);

  const handleOpen = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  return (
    <div>
      {profile && profile == "self" ? (
        <>
          <MenuItem onClick={handleOpen}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            PROFILE
          </MenuItem>
        </>
      ) : (
        <>
          <IconButton onClick={handleOpen}>
            <VisibilityIcon />
          </IconButton>
        </>
      )}
      <Dialog open={open1} onClose={handleClose}>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <Avatar
            src={user.pic}
            alt={user.name}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 2 }}>
            {user.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Email: {user.email}
          </Typography>
          {/* Add other user information here */}
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfileModal;
