import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { tokens } from "../../Theme";
import Header from "../Header";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import DeviceIcon from "@mui/icons-material/DevicesOutlined";
import StatBox from "../StatBox";

export default function Dashboard({ isLoggedIn }) {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const { rooms } = useSelector((state) => state.rooms);
  const { devices } = useSelector((state) => state.devices);

  const latestRooms = rooms.slice(-3);
  const latestDevices = devices.slice(-3);

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
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "0.8vw",
              fontWeight: "bold",
              padding: "1vh 1vw",
            }}
            onClick={handleShowRoomsPage}
          >
            Move to Rooms Page
          </Button>
        </Box>
      </Box>

      <Box
        display={"grid"}
        gridTemplateAreas={"repeat(12, 1fr)"}
        gridAutoRows={"100%"}
        gap={"10%"}
      >
        <Box
          gridColumn={"span 4"}
          backgroundColor={isDarkMode ? "#1F2A40" : "#e0e0e0"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius={"10px"}
        >
          <StatBox
            title={"Latest Rooms"}
            subtitle={` ${latestRooms
              .map((room) => room.name)
              .join(", ")}`}
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
            subtitle={` ${latestDevices
              .map((device) => device.name)
              .join(", ")}`}
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
          gridColumn={"span 8 "}
          gridRow={"span 2"}
          backgroundColor={isDarkMode ? "#1F2A40" : "#e0e0e0"}
          borderRadius={"10px"}
        >
          <Box
            mt={"25px"}
            p={"0 30px"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight={"bold"}
                color={colors.grey[100]}
              >
                Active Rooms
              </Typography>
              <Typography
                variant="h3"
                fontWeight={"500"}
                color={colors.greenAccent[500]}
              >
                {rooms.map((room, index) => (
                  <Typography key={index}>
                    Room Name: {room.name}, RoomType: {room.roomType}
                  </Typography>
                ))}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
