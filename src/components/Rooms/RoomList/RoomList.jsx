import { Box, Card, CardContent, List, ListItem } from "@mui/material";
import React from "react";

export default function RoomList({
  rooms,
  handleRoomSelection,
  colors,
  devices,
}) {
  return (
    <Box m="40px 0 0 0" display="flex" flexWrap="wrap" gap={2}>
      {rooms.map((room, index) => (
        <Card
          key={index}
          onClick={() => handleRoomSelection(room)}
          sx={{
            width: "338px",
            backgroundColor: colors.greenAccent[600],
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
}
