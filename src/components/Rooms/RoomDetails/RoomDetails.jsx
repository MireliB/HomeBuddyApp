import React, { useMemo } from "react";
import DeleteRoomDialog from "../DeleteRoomDialog/DeleteRoomDialog";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../Theme";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RoomDetails({
  isPopupOpen,
  selectedRoom,
  setSelectedRoom,
  setIsPopupOpen,
  handleOpenPopup,
  confirmDelete,
  handleBackToRooms,
  devices,
  loading,
  deviceStatus,
  toggleDeviceStatus,
  handleRoomEdit,
}) {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const filteredDevices = useMemo(() => {
    return devices.filter(
      (device) =>
        device.room && device.room.toString() === selectedRoom._id.toString()
    );
  }, [devices, selectedRoom]);

  if(!selectedRoom){
    return (
      <Box m="40px 0 0 0">
      <Typography variant="h6" color="error">
        No room selected
      </Typography>
      <Button onClick={handleBackToRooms} style={{ color: "white" }}>
        Back to Rooms
      </Button>
    </Box>
    )
  }

  return (
    <Box m="40px 0 0 0">
      <Button onClick={handleBackToRooms} style={{ color: "white" }}>
        Back to Rooms
      </Button>
      <Card
        sx={{
          backgroundImage: `url(/images/${selectedRoom.roomType}.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          mb: 2,
          minHeight: 300,
          position: "relative",
        }}
      >
        <CardContent>
          <Typography variant="h4">
            Room Name: {selectedRoom?.name ?? "No name specified"}
          </Typography>
          <Typography>
            Room Type: {selectedRoom?.roomType ?? "No type specified"}
          </Typography>
          <Box>
            {filteredDevices.map((device) => (
              <Card
                key={device._id}
                sx={{
                  width: 160,
                  p: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  color: "black",
                  backdropFilter: "blur(4px)",
                  borderRadius: 2,
                }}
              >
                <Typography fontWeight={'bold'} >
                 {device.name} -{" "}
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
                      deviceStatus[device._id] === "ON" ? "red" : "green",
                  }}
                >
                  {deviceStatus[device._id] === "ON" ? "Turn Off" : "Turn On"}
                </Button>
              </Card>
            ))}
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <IconButton
              aria-label="edit"
              onClick={() => handleRoomEdit(selectedRoom)}
              style={{ color: colors.grey[100] }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              aria-label="delete"
              onClick={() => handleOpenPopup(selectedRoom)}
              style={{ color: colors.grey[100] }}
            >
              <DeleteIcon />
            </IconButton>

            {isPopupOpen && (
              <DeleteRoomDialog
                isPopupOpen={isPopupOpen}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
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
}
