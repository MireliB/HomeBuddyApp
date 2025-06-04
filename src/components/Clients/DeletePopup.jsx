import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react'

export default function DeletePopup({
  isPopupOpen,
  setIsPopupOpen,
  confirmDeleteUser,
  // selectedUser,
  // setSelectedUser,
}) {
  return (
    <Dialog
      open={isPopupOpen}
      onClose={() => {
        setIsPopupOpen(false);
      }}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete current client?
        <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
          <Button sx={{ color: "red" }} onClick={confirmDeleteUser}>
            Delete
          </Button>
          <Button sx={{ color: "white" }} onClick={() => setIsPopupOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
