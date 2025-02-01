import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Input, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { tokens } from "../../Theme";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const nav = useNavigate();

  const usernameChangeHandler = (e) => {
    setUsername(e.target.value);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  const confirmPasswordChangeHandler = (e) => {
    setConfirmPassword(e.target.value);
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/signUp", {
        username, 
        email,
        password,
      });
      console.log("SignUp response:", response.data);
      if (response.data.message === "User registered successfully") {
        nav("/login");
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error("SignUp error:", err);
      if (err.response) {
        setMessage(
          err.response.data.message || "Failed to sign up. Please try again."
        );
      } else if (err.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Box p={3} bgcolor={"background.paper"} boxShadow={1} borderRadius={2}>
      <Typography variant="h3">Sign Up</Typography>
      <Box component={"form"} onSubmit={signUpHandler}>
        <Box>
          <Typography variant="h5">Username:</Typography>
          <Input
            type="usernsame"
            value={username}
            onChange={usernameChangeHandler}
            required
          />
        </Box>
        <Box>
          <Typography variant="h5">Email:</Typography>
          <Input
            type="email"
            value={email}
            onChange={emailChangeHandler}
            required
          />
        </Box>
        <Box>
          <Typography variant="h5">Password:</Typography>
          <Input
            type="password"
            value={password}
            onChange={passwordChangeHandler}
            required
          />
        </Box>
        <Box>
          <Typography variant="h5">Confirm Password:</Typography>
          <Input
            type="password"
            value={confirmPassword}
            onChange={confirmPasswordChangeHandler}
            required
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ color: "white", mt: 2 }}
          type="submit"
        >
          SIGN UP
        </Button>
      </Box>
      {message && (
        <Typography variant="body2" color="error" mt={2}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
