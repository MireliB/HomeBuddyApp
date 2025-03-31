import { Box, Button, Typography, useTheme } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { tokens } from "../../Theme";

import Header from "../Header";
import LatestRoomsAndDevices from "./LatestRoomsAndDevices/LatestRoomsAndDevices";
import AvailableRooms from "./AvailableRooms/AvailableRooms";
import SystemStatistics from "./SystemStatistics/SystemStatistics";
import AlertsAndNotifications from "./AlertsAndNotifications/AlertsAndNotifications";
import QuickActions from "./QuickActions/QuickActions";
import RecentActions from "./RecentActions/RecentActions";

// TODO :
// הוספת פעולות אחרונות בDASHBOARD - לגרום לזה לעבוד 
// Types of users permissions that need to be added
// Owner
// Admin
// User
// add an icon to admin if the user is the admin for example - crown
// add also an icon to user if the user is with regular permissions
// check about adding more features into dashboard
// change login page to Home Buddy Admin

export default function Dashboard({ isLoggedIn, username, setUsername }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const { rooms } = useSelector((state) => state.rooms || []);
  const { devices } = useSelector((state) => state.devices || []);

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
        {isLoggedIn && (
          <Typography variant="h5" fontWeight={"bold"}>
            Welcome {username || "Guest"}{" "}
            {/* {role === "admin" && (
              <PersonIcon sx={{alignItems:"center", background: "gold" }} />
            )} */}
            {/* {role === "user" && <PersonIcon sx={{ textAlign:"center", mt:1}} />} */}
          </Typography>
        )}

        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": {
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
        display={"grid"}
        gridTemplateColumns={"repeat(2, 0.5fr)"}
        gap={"1.2%"}
      >
        <LatestRoomsAndDevices
          latestDevices={latestDevices}
          latestRooms={latestRooms}
          isDarkMode={isDarkMode}
          colors={colors}
        />

        <AvailableRooms isDarkMode={isDarkMode} colors={colors} rooms={rooms} />

        <SystemStatistics isDarkMode={isDarkMode} colors={colors} />

        <AlertsAndNotifications
          isDarkMode={isDarkMode}
          colors={colors}
          rooms={rooms}
          devices={devices}
        />

        <QuickActions
          isDarkMode={isDarkMode}
          colors={colors}
          rooms={rooms}
          devices={devices}
        />

        <RecentActions isDarkMode={isDarkMode} colors={colors} />
      </Box>
    </Box>
  );
}
