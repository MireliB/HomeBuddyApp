import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Dashboard as DashboardIcon,
  Leaderboard as LeaderboardIcon,
  Room as RoomIcon,
  People as ClientIcon,
  Info as InfoIcon,
  HelpOutline as HelpIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";

const navigationItems = [
  { path: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
  { path: "/leaderboard", name: "Leaderboard", icon: <LeaderboardIcon /> },
  { path: "/roomsPage", name: "Rooms", icon: <RoomIcon /> },
  { path: "/clients", name: "Clients", icon: <ClientIcon /> },
  { path: "/aboutUs", name: "About", icon: <InfoIcon /> },
  { path: "/contacts", name: "Contact", icon: <HelpIcon /> },
  { path: "/finances", name: "Finances", icon: <MoneyIcon /> },
  {
    path: "/notifications",
    name: "Notifications",
    icon: <NotificationsIcon />,
  },
  { path: "/settings", name: "Settings", icon: <SettingsIcon /> },
  { path: "/logout", name: "Logout", icon: <LogoutIcon /> },
];

export default function SideDrawer({ onLogout, isLoggedIn }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const nav = useNavigate();

  const collapsedHandler = () => setIsCollapsed((prev) => !prev);
  const handleLogOut = (path) => {
    if (path === "/logout") {
      onLogout();
      nav("/login");
    } else {
      nav(path);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isLoggedIn && (
        <Box
          sx={{
            "& .pro-sidebar-inner": {
              background: isDarkMode ? "#1f2a40 !important" : "#e0e0e0 !important",
            },
            "& .pro-icon-wrapper": {
              backgroundColor: "transparent !important",
            },
            "& .pro-menu-item.active .pro-inner-item": {
              color: "#868dfb !important",
            },
            "& .pro-inner-item:hover": {
              color: "#868dfb !important",
            },
            "& .pro-inner-item": {
              color: isDarkMode ? "#e0e0e0 !important" : "#1f2a40 !important",
              fontWeight: "bold",
            },
          }}
        >
          <CssBaseline />
          <ProSidebar
            collapsed={isCollapsed}
            style={{ height: "100vh", zIndex: 1000 }}
          >
            <Menu iconShape="square">
              <MenuItem
                onClick={collapsedHandler}
                icon={
                  isCollapsed ? (
                    <MenuIcon
                      sx={{ color: isDarkMode ? "#e0e0e0" : "#1f2a40" }}
                    />
                  ) : undefined
                }
                style={{ margin: "10px 0 20px 0" }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="10px"
                  >
                    <Typography
                      variant="h4"
                      color={isDarkMode ? "#e0e0e0" : "#1f2a40"}
                      fontWeight="bold"
                    >
                      HOME BUDDY
                    </Typography>
                    <IconButton
                      onClick={collapsedHandler}
                      sx={{ color: isDarkMode ? "#e0e0e0" : "#1f2a40" }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              {navigationItems.map(({ path, name, icon }, index) => (
                <MenuItem
                  key={index}
                  icon={icon}
                  active={selected === name}
                  onClick={() => {
                    setSelected(name);
                    handleLogOut(path);
                  }}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </ProSidebar>
        </Box>
      )}
    </Box>
  );
}
