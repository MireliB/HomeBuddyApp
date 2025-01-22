import React from 'react'
import DeleteRoomDialog from '../DeleteRoomDialog/DeleteRoomDialog';
import { Box, Button, Card, CardContent, CircularProgress, IconButton, List, ListItem, Typography, useTheme } from '@mui/material';
import { tokens } from '../../../Theme';

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
  handleRoomEdit
}) {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  return (
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
