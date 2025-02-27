import { Box, IconButton, InputBase } from "@mui/material";
import { useTheme } from "@emotion/react";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function Search({setSearchQuery}) {
  const [search, setSearch] = useState("");
  
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === "dark";

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchQuery(e.target.value.toLowerCase());
  };
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      sx={{
        height: "40px",
        padding: "0 10px",
        width: "208px",
        background: isDarkMode ? "#1F2A40" : "#f0f0f0",
        borderRadius: "8px",
      }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1, color: isDarkMode ? "white" : "black" }}
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
      />
      <IconButton type="button" sx={{ p: 1 }}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
