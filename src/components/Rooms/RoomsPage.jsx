import React, { useCallback, useEffect, useState } from "react";

import { Box } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setDevices } from "../../slice/deviceSlice";
import { CurrentRoom } from "./CurrentRoom";
import { setRooms } from "../../slice/roomSlice";

import Cookies from 'js-cookie'
import axios from "axios";

export default function RoomsPage({ handleBackToRooms,
  selectedRoom,
  setSelectedRoom,
  loading,
  deviceStatus,
  toggleDeviceStatus,
  handleRoomEdit,
  handleOpenPopup,
  isPopupOpen,
  setIsPopupOpen,
  handleRoomSelection,
  confirmDelete,
  message,
  setMessage}) {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState("");

  const token = Cookies.get("token");

  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);

  const getRoomsAndDevices = useCallback(async () => {
    try {
      const roomsResponse = await axios.get("http://localhost:4000/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setRooms(roomsResponse.data));

      const deviceResponse = await axios.get("http://localhost:4000/devices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setDevices(deviceResponse.data));
    } catch (err) {
      setErrorMsg("Failed fetching rooms and devices");
      console.error(err);
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      getRoomsAndDevices();
    }
  }, [token, getRoomsAndDevices]);

  return (
    <Box className="rooms-page-container">
      {errorMsg && <p>{errorMsg}</p>}
      <CurrentRoom
        onAddRoom={() => nav("/addRoom")}
        rooms={rooms}
        devices={devices}
        handleBackToRooms={handleBackToRooms}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        loading={loading}
        deviceStatus={deviceStatus}
        toggleDeviceStatus={toggleDeviceStatus}
        handleRoomEdit={handleRoomEdit}
        handleOpenPopup={handleOpenPopup}
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        handleRoomSelection={handleRoomSelection}
        confirmDelete={confirmDelete}
        message={message}
        setMessage={setMessage}
      />
    </Box>
  );
}
