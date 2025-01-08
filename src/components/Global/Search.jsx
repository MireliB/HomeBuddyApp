import { Box, IconButton, InputBase } from '@mui/material'
import { useTheme } from '@emotion/react';

import SearchIcon from "@mui/icons-material/Search";

export default function Search() {
    const theme = useTheme();

   const isDarkMode = theme.palette.mode === "dark";
 
    return (
      <Box
      display={"flex"}
      alignItems={"center"}
      sx={{
        height: "40px",
        padding: "0 10px",
        width: "300px",
        background: isDarkMode ? "#1F2A40" : "#f0f0f0",
        borderRadius: "8px",
      }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1, color: isDarkMode ? "white" : "black" }}
        placeholder="Search..."
      />
      <IconButton type="button" sx={{ p: 1 }} />
      <SearchIcon />
    </Box>
  )
}
