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
} from "@mui/icons-material";

import {
  Box,
  CssBaseline,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";

import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../Theme";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { path: "/home", name: "Home", icon: <HomeIcon /> },
  { path: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
  { path: "/roomsPage", name: "Rooms", icon: <RoomIcon /> },
  { path: "/aboutUs", name: "About", icon: <InfoIcon /> },
  { path: "/contacts", name: "Contact Information", icon: <HelpIcon /> },
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

  const colors = tokens(theme.palette.mode);

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
              background: `${colors.primary[400]} !important`,
            },
            "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
            "& .pro-inner-item:hover": { color: "#868dfb !important" },
            "& .pro-menu-item.active": { color: "#6870fa !important" },
          }}
        >
          <CssBaseline />
          <ProSidebar collapsed={isCollapsed}>
            <Menu iconShape="square">
              <MenuItem
                onClick={collapsedHandler}
                icon={
                  isCollapsed ? (
                    <MenuIcon sx={{ color: "#e0e0e0" }} />
                  ) : undefined
                }
                style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography
                      variant="h4"
                      color={"#e0e0e0"}
                      fontWeight="bold"
                    >
                      SMART HOME
                    </Typography>
                    <IconButton
                      onClick={collapsedHandler}
                      sx={{ color: "#e0e0e0" }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>

              <Box
                textAlign="center"
                paddingLeft={isCollapsed ? undefined : "10%"}
              >
                {navigationItems.map(({ path, name, icon }, index) => (
                  <MenuItem
                    key={index}
                    icon={icon}
                    onClick={() => handleLogOut(path)}
                    active={selected === name}
                    onMouseEnter={() => handleMouseEnter(name)}
                    onMouseLeave={handleMouseLeave}
                    style={{ color: "#e0e0e0", textAlign: "left" }}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Box>
            </Menu>
          </ProSidebar>
        </Box>
      )}
    </Box>
  );
}
