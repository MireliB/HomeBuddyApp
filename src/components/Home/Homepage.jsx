import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Homepage.module.css";
import Header from "../Header";

export default function Homepage() {
// להוסיף פילטור לפי משתמש והרשאות 

  const nav = useNavigate();

  return (
    <div className={classes["homepage-container"]}>

      <Header
        title={"Make Your Home Smart and Comfortable"}
        subtitle={
          "Our smart solutions elevate your living environment, bringing together innovation and comfort in perfect harmony"
        }
      />
      
      <button
        onClick={() => {
          nav("/dashboard");
        }}
      >
        DASHBOARD PANEL
      </button>
    </div>
  );
}
