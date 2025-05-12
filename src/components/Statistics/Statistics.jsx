import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { Box, Button } from "@mui/material";

export default function Statistics() {

  const nav = useNavigate();

  return (
    <Box p={2}>

      <Header
        title={"Leaderboard"}
        subtitle={
          "Our smart solutions elevate your living environment, bringing together innovation and comfort in perfect harmony"
        }
      />
      
      <Button sx={{color: "white", fontSize: "1.5rem", padding: "1rem", borderRadius: "1rem"}}
        onClick={() => {
          nav("/dashboard");
        }}
      >
        DASHBOARD PANEL
      </Button>
    </Box>
  );
}
