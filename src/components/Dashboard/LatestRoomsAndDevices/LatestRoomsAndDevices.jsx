import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import DeviceIcon from "@mui/icons-material/DevicesOutlined";

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
      <Box>
        <RoomIcon
          sx={{
            color: isDarkMode
              ? colors.greenAccent[500]
              : colors.greenAccent[300],
            fontSize: "2.1vw",
          }}
        />
      </Box>

      <Box>
        <Typography variant="h5" fontWeight={"bold"}>
          Latest Rooms
        </Typography>

        <Divider />
        <Typography
          color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
        >
          {latestRooms.length
            ? latestRooms.map((room) => room.name).join(", ")
            : "No rooms available"}
        </Typography>
      </Box>
      <br />
      <Box>
        <DeviceIcon
          sx={{
            color: isDarkMode
              ? colors.greenAccent[500]
              : colors.greenAccent[300],
            fontSize: "2.1vw",
          }}
        />
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={"bold"}>
          Latest Devices
        </Typography>
        <Divider />
        <Typography
          color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
        >
          {latestDevices.length
            ? latestDevices.map((device) => device.name).join(", ")
            : "No devices available"}
        </Typography>
      </Box>
    </Box>
  );
}
