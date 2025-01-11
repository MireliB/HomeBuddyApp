import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { tokens } from "../../Theme";


import Header from "../Header";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import DeviceIcon from "@mui/icons-material/DevicesOutlined";
import { RoomOutlined } from "@mui/icons-material";

import StatBox from "../StatBox";

export default function Dashboard({ isLoggedIn }) {
  const theme = useTheme();
  const matches = useMediaQuery('(min-width:600px)');
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);

  const latestRooms = rooms.slice(-3) || [];
  const latestDevices = devices.slice(-3) || [];

  const isDarkMode = theme.palette.mode === "dark";

  const handleShowRoomsPage = () => {
    navigate("/roomsPage");
  };
  
  return (
    <Box m={"2vh"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          title="DASHBOARD"
          subtitle="Welcome to your smart home Dashboard panel! From here, you can manage your home's devices with ease."
        />

        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[500],

              },
              color: colors.grey[100],
              fontSize: "100%",
              fontWeight: "bold",
              padding: "4% 10px",
            }}
            onClick={handleShowRoomsPage}
          >
            Move to Rooms Page
          </Button>
        </Box>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"row"}
        mt={"20px"}
        p={"0"}
        width={"100%"}
        height={"100%"}
        gap={"16px"}
        >
        <Box
          backgroundColor={isDarkMode ? "#1F2A40" : "#e0e0e0"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius={"10px"}
          width={"50%"}
          
        >
          <StatBox
            title={"Latest Rooms"}
            subtitle={` ${latestRooms.length ? latestRooms
              .map((room) => room.name)
              .join(", "): "No rooms available"}`}
            icon={
              <RoomIcon
                sx={{
                  color: isDarkMode ? "#3da58a" : "#2e7c67",
                  fontSize: "2.1vw",
                }}
              />
            }
          ></StatBox>
          <StatBox
            title={"Latest Devices"}
            subtitle={` ${latestDevices.length ? latestDevices
              .map((device) => device.name)
              .join(", "): "No devices available"}`}
            icon={
              <DeviceIcon
                sx={{
                  color: isDarkMode ? "#3da58a" : "#2e7c67",
                  fontSize: "2.1vw",
                }}
              />
            }
          ></StatBox>
        </Box>

        <Box
          display={"flex"}
          width={"50%"}
          flexDirection={"column"}
          backgroundColor={isDarkMode ? "#1F2A40" : "#e0e0e0"}
          borderRadius={"10px"}
        >
          <Box 
            mt={"20px"}
            p={"0 40px"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box height={"208px"}
            >
              <Typography
                variant="h3"
                fontWeight={"bold"}
                color={colors.grey[100]} 
              >
                Available Rooms
              </Typography>
              <Typography
                variant="h3"
                fontWeight={"500"}
                color={colors.greenAccent[500]}
              >
                {rooms.length ?rooms.map((room, index) => (
                  <Typography key={index}>
                    Room Name: {room.name}, RoomType: {room.roomType}
                  </Typography>
                )): "No Available Rooms"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
