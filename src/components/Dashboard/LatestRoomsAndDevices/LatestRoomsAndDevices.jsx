import { Box } from "@mui/material";
import React from "react";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import DeviceIcon from "@mui/icons-material/DevicesOutlined";
import StatBox from "../../StatBox";

export default function LatestRoomsAndDevices({
  latestRooms,
  latestDevices,
  isDarkMode,
  colors,
}) {
  return (
    <Box
      style={{
        padding: "16px",
        backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
        borderRadius: "10px",
      }}
    >
      <RoomIcon
        sx={{
          color: isDarkMode ? colors.greenAccent[500] : colors.greenAccent[300],
          fontSize: "2.1vw",
        }}
      />
      <StatBox
        title={"Latest Rooms"}
        subtitle={` ${
          latestRooms.length
            ? latestRooms.map((room) => room.name).join(", ")
            : "No rooms available"
        }`}
      ></StatBox>
      <DeviceIcon
        sx={{
          color: isDarkMode ? colors.greenAccent[500] : colors.greenAccent[300],
          fontSize: "2.1vw",
        }}
      />
      <StatBox
        title={"Latest Devices"}
        subtitle={` ${
          latestDevices.length
            ? latestDevices.map((device) => device.name).join(", ")
            : "No devices available"
        }`}
      ></StatBox>
    </Box>
  );
}
