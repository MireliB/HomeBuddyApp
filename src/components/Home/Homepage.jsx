import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Homepage.module.css";
import Header from "../Header";
import { Box, Button } from "@mui/material";

export default function Homepage() {

  const nav = useNavigate();

  return (
    <Box className={classes["homepage-container"]}>

      <Header
        title={"Make Your Home Smart and Comfortable"}
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
