import React from "react";
import { Box, Card, CardContent, CardMedia, List, ListItem, useTheme } from "@mui/material";
import kitchenImg from '../../../media/kitchen.jpg'
import bedroomImg from '../../../media/bedroom.jpg'
import officeImg from '../../../media/office.jpg'
import livingRoomImg from '../../../media/livingRoom.jpg'
import defaultImg from '../../../media/defaultRoom.jpg';
import { tokens } from "../../../Theme";
export default function RoomList({
  rooms,
  handleRoomSelection,
  // colors,
  devices,
}) {

const getRoomImage = (type) => {
  switch (type?.toLowerCase()) {
    case "kitchen":
      return kitchenImg;
    case "living room":
      return livingRoomImg;
    case "bedroom":
      return bedroomImg;
    case "office":
      return officeImg;
    default:
      return defaultImg;
  }
};
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box m="40px 0 0 0" display="flex" flexWrap="wrap" gap={2}>
      {rooms.map((room, index) => (
        <Card
          key={index}
          onClick={() => handleRoomSelection(room)}
          sx={{
            width: "308px",
            backgroundImage: getRoomImage(room.roomType),
            backgroundColor: isDarkMode ? colors.primary[500] : colors.grey[800],
            color: isDarkMode ? colors.grey[100] : colors.blueAccent[100],
            cursor: "pointer",
          }}
        >
          <CardMedia
            component={"img"}
            height={"180"}
            image={getRoomImage(room.roomType)}
            alt={`Room Type: ${room.roomType}`}
          />
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
