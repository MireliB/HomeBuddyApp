import { Box, Button, useTheme } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { tokens } from "../../Theme";

import Header from "../Header";

import LatestRoomsAndDevices from "./LatestRoomsAndDevices/LatestRoomsAndDevices";
import AvailableRooms from "./AvailableRooms/AvailableRooms";
import SystemStatistics from "./SystemStatistics/SystemStatistics";
import AlertsAndNotifications from "./AlertsAndNotifications/AlertsAndNotifications";
import QuickActions from "./QuickActions/QuickActions";
import { useEffect, useState } from "react";
import axios from "axios";

// TODO :
// add also an icon to user if the user is with regular permissions
// work on language translation
// add a button to the user to change the language of the app
// check about adding more features into dashboard
// create another project of home buddy to the clients at phone
//  on sidebar Change from Home To Statistics and make Dashboard first 
// TODO - LEARN PYTHON AND C#
export default function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [stats, setStats] = useState(null); 

  const navigate = useNavigate();

  const { rooms } = useSelector((state) => state.rooms || []);
  const { devices } = useSelector((state) => state.devices || []);

  const latestRooms = rooms?.slice(-3) || [];
  const latestDevices = devices?.slice(-3) || [];

  const isDarkMode = theme.palette.mode === "dark";

  const handleShowRoomsPage = () => {
    navigate("/roomsPage");
  };

  useEffect(()=>{
    const fetchStats = async()=>{
      try{
        const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        if(!token) {
          console.error("No token found in cookies.");
          return;
        }
        const response = await axios.get("http://localhost:4000/system-statistics", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setStats(response.data);

      }catch(err){
        console.error(" Failede to fetch system statistics:", err);
      }
    };

    fetchStats();
  },[])
  return (
    <Box m={"2vh"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Header
          userRole="Admin"
          title="DASHBOARD"
          subtitle="Welcome to your smart home Dashboard panel! From here, you can manage your home's devices with ease."
        />

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
        gridTemplateColumns="repeat(auto-fit, minmax(350px, 1fr))"
        gap={"1.2%"}
      >
        <LatestRoomsAndDevices
          latestDevices={latestDevices}
          latestRooms={latestRooms}
          isDarkMode={isDarkMode}
          colors={colors}
        />

        <AvailableRooms isDarkMode={isDarkMode} colors={colors} rooms={rooms} />

        {stats ? (
          <SystemStatistics
            isDarkMode={isDarkMode}
            colors={colors}
            stats={stats}
          />
        ) : (
          ""
        )}

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
      </Box>
    </Box>
  );
}
