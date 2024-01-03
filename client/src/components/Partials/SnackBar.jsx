import React from "react";

const SnackBar = () => {
  return (
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
  );
};

export default SnackBar;
