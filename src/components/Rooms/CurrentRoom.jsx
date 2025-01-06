import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { tokens } from "../../Theme";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  Snackbar,
  Typography,
  IconButton,
} from "@mui/material";

import { deleteRoom } from "../../slice/roomSlice";
import { setDevices } from "../../slice/deviceSlice";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteRoomDialog from "./DeleteRoomDialog/DeleteRoomDialog";
import Header from "../Header";

import axios from "axios";

export function CurrentRoom({ onAddRoom, rooms, devices }) {
  const nav = useNavigate();

  const dispatch = useDispatch();

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const [message, setMessage] = useState({ show: false, text: "", color: "" });
  const [loadDevice, setLoadDevice] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deviceStatus, setDeviceStatus] = useState(
    devices.reduce((acc, device) => {
      acc[device._id] = device.status;

      return acc;
    }, {})
  );

  const handleRoomSelection = (room) => setSelectedRoom(room);

  const handleBackToRooms = () => setSelectedRoom(null);

  const toggleDeviceStatus = (device) => {
    setLoadDevice((prevState) => ({
      ...prevState,
      [device._id]: true,
    }));

    const newStatus = deviceStatus[device._id] === "OFF" ? "ON" : "OFF";

    setTimeout(async () => {
      try {
        await updateDeviceStatus(device._id, newStatus);
        setDeviceStatus((prevState) => ({
          ...prevState,
          [device._id]: newStatus,
        }));
        setMessage({
          show: true,
          text: `Device ${device.name} turned ${newStatus}`,
          color: newStatus === "on" ? "green" : "red",
        });
      } catch (err) {
        console.error("Error updating device status: ", err);
      } finally {
        setLoadDevice((prevState) => ({
          ...prevState,
          [device._id]: false,
        }));
      }
    }, 1000);
  };

  const updateDeviceStatus = async (deviceId, status) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:4000/device/${deviceId}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleOpenPopup = (room) => {
    setSelectedRoom(room);
    setIsPopupOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRoom && selectedRoom._id) {
      await handleDeleteRoom();
      setIsPopupOpen(false);
      setSelectedRoom(null);
    }
  };

  const handleRoomEdit = async (room) => {
    nav(`/editRoom/${selectedRoom._id}`, {
      state: { room },
    });
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom || !selectedRoom._id) return;

    const roomId = selectedRoom._id;
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No Token found. Please log in again.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:4000/room/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Room deleted successfully", response.data);

      dispatch(deleteRoom({ roomId }));

      const updateDevices = devices.filter((device) => device.room !== roomId);

      dispatch(setDevices(updateDevices));

      setMessage({
        show: true,
        text: "Room deleted successfully",
        color: "red",
      });

      handleBackToRooms();
    } catch (err) {
      console.error("Error Deleting Room:", err);
    }
  };

  const renderRoomDetails = () => (
    <Box m="40px 0 0 0">
      <Button onClick={handleBackToRooms} style={{ color: "white" }}>
        Back to Rooms
      </Button>
      <Card
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          mb: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5">
            Room Name: {selectedRoom.name || "No name specified"}
          </Typography>
          <Typography variant="body2">
            Room Type: {selectedRoom.roomType || "No type specified"}
          </Typography>
          <List>
            {devices
              .filter(
                (device) =>
                  device.room &&
                  device.room.toString() === selectedRoom._id.toString()
              )
              .map((device) => (
                <ListItem key={device._id}>
                  <Typography variant="body2" style={{ flexGrow: 1 }}>
                    Device: {device.name} -
                    {loading && deviceStatus[device._id] !== device.status ? (
                      <CircularProgress size={14} />
                    ) : (
                      deviceStatus[device._id]
                    )}
                  </Typography>

                  <Button
                    onClick={() => toggleDeviceStatus(device)}
                    disabled={loading}
                    variant="contained"
                    style={{
                      color: "white",
                      backgroundColor:
                        deviceStatus[device._id] === "ON" ? "green" : "red",
                    }}
                  >
                    {deviceStatus[device._id] === "ON" ? "Turn Off" : "Turn On"}
                  </Button>
                </ListItem>
              ))}
          </List>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <IconButton
              aria-label="edit"
              onClick={(e) => {
                e.stopPropagation();
                handleRoomEdit(selectedRoom);
              }}
              style={{ color: colors.grey[100] }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenPopup(selectedRoom);
              }}
              style={{ color: colors.grey[100] }}
            >
              <DeleteIcon />
            </IconButton>

            {isPopupOpen && (
              <DeleteRoomDialog
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                isPopupOpen={isPopupOpen}
                setIsPopupOpen={setIsPopupOpen}
                handleOpenPopup={handleOpenPopup}
                confirmDelete={confirmDelete}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderRoomList = () => (
    <Box m="40px 0 0 0" display="flex" flexWrap="wrap" gap={2}>
      {rooms.map((room, index) => (
        <Card
          key={index}
          onClick={() => handleRoomSelection(room)}
          sx={{
            width: "300px",
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            cursor: "pointer",
          }}
        >
          <CardContent>
            <Typography variant="h5">
              Room Name: {room.name || "No name specified"}
            </Typography>
            <Typography variant="body2">
              Room Type: {room.roomType || "No type specified"}
            </Typography>
            <Typography variant="body2">Devices:</Typography>
            <List>
              {devices
                .filter(
                  (device) =>
                    device.room &&
                    device.room.toString() === room._id.toString()
                )
                .map((device) => (
                  <ListItem key={device._id}>Device: {device.name}</ListItem>
                )) || <ListItem>No devices</ListItem>}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box m="2dvh">
      <Header
        title={"Rooms Page"}
        subtitle={
          "This space allows you to create and manage rooms, providing you with control over various technologies within your home."
        }
      />

      {selectedRoom ? renderRoomDetails() : renderRoomList()}
      
      {!selectedRoom && (
        <Button
          variant="contained"
          style={{ marginTop: "2dvh" }}
          onClick={onAddRoom}
        >
          + Add A Room
        </Button>
      )}

      <Snackbar
        open={message.show}
        autoHideDuration={3000}
        onClose={() => setMessage({ ...message, show: false })}
        message={
          <span style={{ color: message.color }}>
            {message.color === "green" ? (
              <CheckCircleOutline />
            ) : (
              <ErrorOutline />
            )}
            {message.text}
          </span>
        }
      />
    </Box>
  );
}
