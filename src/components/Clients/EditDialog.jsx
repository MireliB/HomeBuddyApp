import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { MenuItem } from "react-pro-sidebar";

export default function EditDialog({
  editClientData,
  setEditClientData,
  handleEditSubmit,
}) {
  return (
    <Dialog
      open={Boolean(editClientData)}
      onClose={() => setEditClientData(null)}
    >
      <DialogTitle>Edit Client</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          fullWidth
          margin="dense"
          value={editClientData?.username || ""}
          onChange={(e) =>
            setEditClientData({
              ...editClientData,
              username: e.target.value,
            })
          }
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={editClientData?.email || ""}
          onChange={(e) =>
            setEditClientData({ ...editClientData, email: e.target.value })
          }
        />
        <TextField
          label="Role"
          fullWidth
          margin="dense"
          value={editClientData?.role || ""}
          onChange={(e) =>
            setEditClientData({ ...editClientData, role: e.target.value })
          }
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Active</InputLabel>
          <Select
            value={editClientData?.isActive ? true : false}
            label="Active"
            onChange={(e) =>
              setEditClientData({
                ...editClientData,
                isActive: e.target.value ? true : false,
              })
            }
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditClientData(null)}>Cancel</Button>
        <Button onClick={handleEditSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
