import React, { useState, useEffect, useMemo } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { editRoom } from "../../slice/roomSlice";
import EditRoomDialog from "./EditRoomDialog/EditRoomDialog";
import Cookies from "js-cookie";
import axios from "axios";

export default function EditRoom({ editRoomData: room, open, onClose }) {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [roomName, setRoomName] = useState(room?.name || "");
  const [roomType, setRoomType] = useState(room?.roomType || "");
  const [devices, setDevices] = useState(room?.devices || []);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const token = useMemo(() => Cookies.get("token"), []);

  useEffect(() => {
    setRoomName(room?.name || "");
    setRoomType(room?.roomType || "");
    setDevices(room?.devices || []);
  }, [room]);

  const handleSave = async () => {
    const updateRoom = {
      _id: room._id,
      name: roomName,
      roomType,
      devices,
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/room/${room._id}`,
        updateRoom,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Room updated successfully", response.data);

      dispatch(editRoom(updateRoom));
      onClose();
      nav("/roomsPage");
    } catch (err) {
      console.error(
        " Error updating room: ",
        err.response ? err.response.data : err.message
      );
    }
  };
  
  const confirmEdit = () => {
    handleSave();
    setIsEditPopupOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Room Type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography variant="body2" mt={2}>
            Devices:
          </Typography>
          {devices.map((d) => (
            <Typography key={d._id} variant="body2">
              {d.name}
            </Typography>
          ))}
          <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => setConfirmDialogOpen(true)}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <EditRoomDialog
        isEditPopupOpen={confirmDialogOpen}
        setIsEditPopupOpen={setConfirmDialogOpen}
        confirmEdit={confirmEdit}
      />
    </>
  );
}
