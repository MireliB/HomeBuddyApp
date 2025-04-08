import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  HomeOutlined as HomeIcon,
  Dashboard as DashboardIcon,
  Room as RoomIcon,
  Info as InfoIcon,
  HelpOutline as HelpIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  People as ClientIcon,
} from "@mui/icons-material";

import {
  Box,
  CssBaseline,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";

import "react-pro-sidebar/dist/css/styles.css";
import './SideDrawer.module.css'
import { useNavigate } from "react-router-dom";
import Chat from "../ChatBot/Chat";

const navigationItems = [
  { path: "/home", name: "Home", icon: <HomeIcon /> },
  { path: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
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

  const collapsedHandler = () => setIsCollapsed(!isCollapsed);

  const handleMouseEnter = (name) => setSelected(name);

  const handleMouseLeave = () => setSelected("");

  const handleLogOut = (path) => {
    if (path === "/logout") {
      onLogout();
      nav("/login");
    } else {
      nav(path);
    }
  };

  return (
    <Box height="100%">
      {isLoggedIn && (
        <Box
          sx={{
            height: "100vh",
            "& .pro-sidebar-inner, & .pro-icon-wrapper": {
              background: `${isDarkMode ? "#1f2a40" : "#e0e0e0"} !important`,
            },
            "& .pro-inner-item:hover, & .pro-inner-item.active": {
              color: "#868dfb !important",
            },
            "& .pro-inner-item.active": { color: "#868dfb !important" },
          }}
        >
          <CssBaseline />
          <ProSidebar collapsed={isCollapsed}>
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
                  onClick={() => handleLogOut(path)}
                  active={selected === name}
                  onMouseEnter={() => handleMouseEnter(name)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    color: isDarkMode ? "#e0e0e0" : "#1f2a40",
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
            <Chat/>
          </ProSidebar>
        </Box>
      )}
    </Box>
  );
}
