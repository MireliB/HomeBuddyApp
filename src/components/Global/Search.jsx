import { Box, IconButton, InputBase } from '@mui/material'
import React, { useContext } from 'react'
import { ColorModeContext } from '../../Theme';
import { useTheme } from '@emotion/react';
import { IoMdSearch } from 'react-icons/io';

export default function Search() {
    const theme = useTheme();

   const colorMode = useContext(ColorModeContext);
   const isDarkMode = theme.palette.mode === "dark";
 
    return (
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
    <IconButton type="button" sx={{ p: 1 }} >

    <IoMdSearch />

    </IconButton>
  </Box>
  )
}
