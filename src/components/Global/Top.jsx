import { useContext } from "react";
import { Box, IconButton, MenuItem, Select, useTheme } from "@mui/material";
import { ColorModeContext } from "../../Theme";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function Top() {

  const theme = useTheme();

  const colorMode = useContext(ColorModeContext);

  // add here :
  // notification alerts 
  // settings navigation
  // user profile navigation - build also component for user profile
  // user profile settings
  // user profile logout

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box display="flex" ml="auto">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonOutlineOutlinedIcon />
          <Select defaultValue={"user1"} variant="outlined" size="small">
            <MenuItem value="user1">User 1</MenuItem>
            <MenuItem value="user2">User 2</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
