import { useTheme } from "@emotion/react";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";

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


import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteRoomDialog from "./DeleteRoomDialog/DeleteRoomDialog";
import Header from "../Header";

import Search from "../Global/Search";
import RoomDetails from "./RoomDetails/RoomDetails";

export function CurrentRoom({
  onAddRoom,
  rooms,
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

  const handleRoomEdit = async (room) => {
    nav(`/editRoom/${selectedRoom._id}`, {
      state: { room },
    });
  };


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
            <ListItem variant="h5">
              Room Name: {room.name || "No name specified"}
            </ListItem>
            <ListItem variant="body2">
              Room Type: {room.roomType || "No type specified"}
            </ListItem>
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
        title={"Rooms"}
        subtitle={
          "This space allows you to create and manage rooms, providing you with control over various technologies within your home."
        }
      />
      <Search />
      {selectedRoom ? (
        <RoomDetails
          isPopupOpen={isPopupOpen}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsPopupOpen={setIsPopupOpen}
          handleOpenPopup={handleOpenPopup}
          confirmDelete={confirmDelete}
          handleBackToRooms = {handleBackToRooms}
          devices = {devices}
          loading = {loading}
          deviceStatus = {deviceStatus}
          toggleDeviceStatus=  {toggleDeviceStatus}
          handleRoomEdit = {handleRoomEdit}
        />
      ) : (
        renderRoomList()
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
