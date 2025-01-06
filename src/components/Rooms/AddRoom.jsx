import React, { useState } from "react";

import axios from "axios";

import { Box, Button, Input, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addRoom } from "../../slice/roomSlice";

import Cookies from 'js-cookie'

import Header from "../Header";

export default function AddRoom() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState("OFF");

  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  const roomNameChangeHandler = (e) => setRoomName(e.target.value);

  const roomTypeChangeHandler = (e) => setRoomType(e.target.value);

  const deviceChangeHandler = (e) => setDeviceName(e.target.value);

  const handleAddRoom = async () => {
    setErrorMsg("");
    setLoading(true);

    if (roomName && roomType) {
      setLoading(true);

      try {
        const newRoom = {
          name: roomName,
          roomType: roomType,
          devices: [],
        };

        const response = await axios.post(
          "http://localhost:4000/room",
          newRoom,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const createdRoom = response.data;

        dispatch(addRoom(createdRoom));

        // if (deviceName) {
          const newDevice = {
            name: deviceName,
            status,
            room: createdRoom._id,
          };
          try {
            await axios.post("http://localhost:4000/device", newDevice, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (deviceError) {
            if (deviceError.response && deviceError.response.status === 400) {
              setErrorMsg(
                "Device with the same name already exist in this room "
              );
            } else {
              setErrorMsg("Failed to add device. Please try again.");
            }
          }
        // }

        setRoomName("");
        setRoomType("");
        setDeviceName("");

        setStatus("OFF");

        setLoading(false);

        nav("/roomsPage");
      } catch (err) {
        setLoading(false);

        console.error("Error adding room:", err);

        if (err.response) {
          setErrorMsg(
            err.response.data.message ||
              "An unexpected error occurred. Please try again."
          );
        } else if (err.request) {
          setErrorMsg("No response from the server. Please try again later");
        } else {
          setErrorMsg("An unexpected error occurred. Please try again.");
        }
      }
    } else {
      setErrorMsg("Please fill out the room name and type.");
    }
  };

  return (
    <Box m={2}>
      <Header
        title="Add Room"
        subtitle="You Can Create a Room and Choose a Type of Room"
      />

      <Typography>Room Name</Typography>
      <Input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={roomNameChangeHandler}
      />
      <Typography>Room Type</Typography>
      <Input
        type="text"
        placeholder="Room Type"
        value={roomType}
        onChange={roomTypeChangeHandler}
      />
      <Typography>Device Name</Typography>
      <Input
        type="text"
        placeholder="Device Name"
        value={deviceName}
        onChange={deviceChangeHandler}
      />
      <Button onClick={handleAddRoom} variant="contained" disabled={loading}>
        {loading ? "Creating..." : " + Create Room"}
      </Button>
      {errorMsg && <Typography color="error">{errorMsg}</Typography>}
    </Box>
  );
}
