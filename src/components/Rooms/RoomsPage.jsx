import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  setMessage,
  editRoomData,
  setEditRoomData,
  isEditDialogOpen,
  setIsEditDialogOpen
}) {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [token, setToken] = useState(()=> Cookies.get("token"));

  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);

  const headers = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : null;
  }, [token]);

  const getRoomsAndDevices = useCallback(
    async (controller) => {
      try {
        if (!headers) {
          setErrorMsg("Authentication token is missing");
          return;
        }
        setIsLoading(true);
        
        const [roomsResponse, deviceResponse] = await Promise.all([
          axios.get("http://localhost:4000/rooms", {
            headers,
            signal: controller.signal,
          }),
          axios.get("http://localhost:4000/devices", {
            headers,
            signal: controller.signal,
          }),
        ]);

        dispatch(setRooms(roomsResponse.data));
        dispatch(setDevices(deviceResponse.data));
      } catch (err) {
        if (axios.isCancel(err)) return;
        setErrorMsg(
          err.response?.data?.message || "Failed fetching rooms and devices"
        );
        console.error("Error fetching data:", err);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const controller = new AbortController();
    getRoomsAndDevices(controller);

    return () => controller.abort();
  }, [getRoomsAndDevices]);

  return (
    <Box className="rooms-page-container">
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
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
        editRoomData={editRoomData}
        setEditRoomData={setEditRoomData}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        handleOpenPopup={handleOpenPopup}
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        handleRoomSelection={handleRoomSelection}
        confirmDelete={confirmDelete}
        message={message}
        setMessage={setMessage}
        isLoading={isLoading}
      />
    </Box>
  );
}
