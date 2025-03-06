import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Box, Button, Snackbar } from "@mui/material";

import { tokens } from "../../Theme";



import Search from "../Global/Search";
import RoomDetails from "./RoomDetails/RoomDetails";
import RoomList from "./RoomList/RoomList";
import Header from "../Header";

export function CurrentRoom({
  onAddRoom,
  rooms = [],
  devices,
  selectedRoom,
  setSelectedRoom,
  loading,
  deviceStatus,
  toggleDeviceStatus,
  handleBackToRooms,
  handleOpenPopup,
  isPopupOpen,
  setIsPopupOpen,
  handleRoomSelection,
  confirmDelete,
  message,
  setMessage,
}) {
  const nav = useNavigate();

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const [searchQuery, setSearchQuery] = useState("");

  const lowerCaseQuery = useMemo(
    () => searchQuery.toLowerCase().trim(),
    [searchQuery]
  );

  const filteredRooms = (rooms ?? []).filter((room) => {
    const matchesRoomName = room.name.toLowerCase().includes(lowerCaseQuery);
    const matchesRoomType =
      room.roomType?.toLowerCase()?.includes(lowerCaseQuery) || false;

    const matchesDevices = (devices ?? []).some(
      (device) =>
        device.roomId === room._id &&
        device.name.toLowerCase().includes(lowerCaseQuery)
    );

    return matchesRoomName || matchesRoomType || matchesDevices;
  });

  const handleRoomEdit = async (room) => {
    if (!room || !room._id) return;
    nav(`/editRoom/${room._id}`, {
      state: { room },
    });
  };

  return (
    <Box m="2dvh">
      <Header
        title={"Rooms"}
        subtitle={
          "This space allows you to create and manage rooms, providing you with control over various technologies within your home."
        }
      />
      <Search setSearchQuery={setSearchQuery} />
      
      {selectedRoom ? (
        <RoomDetails
          isPopupOpen={isPopupOpen}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsPopupOpen={setIsPopupOpen}
          handleOpenPopup={handleOpenPopup}
          confirmDelete={confirmDelete}
          handleBackToRooms={handleBackToRooms}
          devices={devices}
          loading={loading}
          deviceStatus={deviceStatus}
          toggleDeviceStatus={toggleDeviceStatus}
          handleRoomEdit={handleRoomEdit}
        />
      ) : (
        <RoomList
          rooms={filteredRooms}
          handleRoomSelection={handleRoomSelection}
          colors={colors}
          devices={devices}
        />
      )}

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
        open={message?.show}
        autoHideDuration={3000}
        onClose={() => setMessage({ ...message, show: false })}
        message={
          <span style={{ color: message?.color || "black" }}>
            {message.color === "green" ? (
              <CheckCircleOutline />
            ) : (
              <ErrorOutline />
            )}
            {message?.text}
          </span>
        }
      />
    </Box>
  );
}