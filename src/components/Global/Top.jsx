import { useContext } from "react";
import { Box, IconButton, Select, useTheme } from "@mui/material";
import { ColorModeContext } from "../../Theme";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersoneOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function Top() {

  const theme = useTheme();

  const colorMode = useContext(ColorModeContext);

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
        <IconButton>
          <PersoneOutlinedIcon />
          <Select></Select>
        </IconButton>
      </Box>
    </Box>
  );
}
