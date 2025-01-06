import React, { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setDevices } from "../../slice/deviceSlice";
import { setRooms } from "../../slice/roomSlice";
import Cookies from 'js-cookie'
import axios from "axios";

import { EmptyRoom } from "./EmptyRoom";

export default function RoomsPage() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState("");

  const token = Cookies.get("token");

  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);

  useEffect(() => {
    if (token) {
      getRoomsAndDevices();
    }
  }, [token]);

  const getRoomsAndDevices = async () => {
    try {
      const roomsResponse = await axios.get("http://localhost:4000/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Rooms:", roomsResponse.data);

      dispatch(setRooms(roomsResponse.data));

      const deviceResponse = await axios.get("http://localhost:4000/devices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched devices:", deviceResponse.data);

      dispatch(setDevices(deviceResponse.data));
    } catch (err) {
      console.error("haha", err);
    }
  };
  return (
    <Box className="rooms-page-container">
      {errorMsg && <p>{errorMsg}</p>}
      <EmptyRoom
        onAddRoom={() => nav("/addRoom")}
        rooms={rooms}
        devices={devices}
      />
    </Box>
  );
}
