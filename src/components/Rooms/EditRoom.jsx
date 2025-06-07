import React, { useState, useEffect, useMemo } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { editRoom } from "../../slice/roomSlice";
import EditRoomDialog from "./EditRoomDialog/EditRoomDialog";
import Cookies from 'js-cookie'
import axios from "axios";

export default function EditRoom() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const { state } = useLocation();

  const { room } = state;

  const [roomName, setRoomName] = useState(room?.name || "");
  const [roomType, setRoomType] = useState(room?.roomType || "");
  const [devices, setDevices] = useState(room?.devices || []);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const token = useMemo(() => Cookies.get("token"), []); 

  useEffect(() => {
    if (room) {
      setRoomName(room.name || "");
      setRoomType(room.roomType || "");
      setDevices(room.devices || []);
    }
  }, [room]);

  const handleSave = async () => {
    const updateRoom = {
      _id: room._id,
      name: roomName,
      roomType,
      devices: devices,
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

      nav("/roomsPage");
    } catch (err) {
      console.error(
        " Error updating room: ",
        err.response ? err.response.data : err.message
      );
    }
  };
  const handleCancel = () => {
    nav("/roomsPage");
  };

  const confirmEdit = () => {
    handleSave();
    setIsEditPopupOpen(false);
  };

  return (
    <Box m="40px 0">
      <Card>
        <CardContent>
          <Typography variant="h5">Edit Room</Typography>
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
          {devices.map((device) => (
            <Typography key={device._id} variant="body2">
              {device.name}
            </Typography>
          ))}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditPopupOpen(true)}
            >
              Save Changes
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>

      <EditRoomDialog
        isEditPopupOpen={isEditPopupOpen}
        setIsEditPopupOpen={setIsEditPopupOpen}
        confirmEdit={confirmEdit}
      />
    </Box>
  );
}
