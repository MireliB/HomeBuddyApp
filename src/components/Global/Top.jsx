import { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ColorModeContext } from "../../Theme";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutIcon from "@mui/icons-material/ExitToApp";

export default function Top({ onLogout, username, userRole, setUserRole, userEmail }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const nav = useNavigate();
  // add here :
  // notification alerts
  // user profile navigation - build also component for user profile
  // user profile settings
  // user profile logout
  // add 2 client functions for Google auth - 1 for me the owner and second one for the user

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleNotificationMenuOpen = (e) => {
    setNotificationAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    nav("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h6" fontWeight="bold" ml={2}>
          Welcome,
        </Typography>
        <Typography
          variant="h6"
          color="secondary"
          fontWeight="bold"
          display="flex"
          alignItems="center"
        >
          {username}
          {userRole === "manager" && userEmail === process.env.REACT_APP_MANAGER_EMAIL && (
            <FaCrown
              style={{
                color: "gold",
                marginLeft: "7px",
                marginBottom: "2px",
                fontSize: "1.2rem",
              }}
            />
          )}
        </Typography>
        
      </Box>
      <Box display="flex" ml="auto">
        <Tooltip title="Toggle Theme">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton onClick={handleNotificationMenuOpen}>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
        </Menu>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleProfileMenuOpen}>
            <PersonOutlineOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => nav("/userProfile/:userId")}>
              <PersonOutlineOutlinedIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => nav("/settings")}>
              <SettingsOutlinedIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}
