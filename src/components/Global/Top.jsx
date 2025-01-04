// import React, { useState } from "react";
import { useContext, useState } from "react";
import { Box, IconButton, Select, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../Theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersoneOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";

export default function Top() {

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const colorMode = useContext(ColorModeContext);
  const isDarkMode = theme.palette.mode === "dark";
  // const handleSearchChange = (e) => {
  //   const searchTerm = e.target.value;
  //   setSearchField(searchTerm);
  // };

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      p={2}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={{
          height: "40px",
          padding: "0 10px",
          width: "300px",
          background: isDarkMode ? "#141b2d" : "#f0f0f0",
          borderRadius: "8px",
        }}
      >
        {/* SEARCH */}
        <InputBase
          sx={{ ml: 2, flex: 1, color: isDarkMode ? "white" : "black" }}
          placeholder="Search..."
        />
        <IconButton type="button" sx={{ p: 1 }} />
        <SearchIcon />
      </Box>

      <Box display={"flex"}>
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
