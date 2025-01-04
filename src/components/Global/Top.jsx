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
        backgroundColor={colors.primary[400]}
        borderRadius={"8px"}
        sx={{ height: "40px", padding: "0 10px", width: "300px" }}
      >
        {/* SEARCH */}
        <InputBase
          sx={{ ml: 2, flex: 1, color: colors.grey[100] }}
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
