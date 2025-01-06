import React, { useState } from "react";

import { Box, Button, Input, Link, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

import "./Login.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  
  const [errorMsg, setErrorMsg] = useState("");

  const nav = useNavigate();

  const navigateToSignUp = () => nav("/signup");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(
              data.message || "Failed to Login. Please try Again"
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login Response: ", data);

        localStorage.setItem("token", data.token);
        localStorage.setItem("loginTime", JSON.stringify(Date.now()));
        localStorage.setItem("userEmail", email);

        onLogin(email);
        nav("/dashboard");
      });
  };

  return (
    <Box className="login-wrapper">
      <Typography variant="h3">Login</Typography>
      <Box component={"form"} onSubmit={handleLogin}>
        <Box>
          <Typography variant="h5">Email:</Typography>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Box>
        <Box>
          <Typography variant="h5">Password:</Typography>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ color: "white", mt: 2 }}
          type="submit"
        >
          LOGIN
        </Button>
      </Box>
      {errorMsg && (
        <Typography variant="body2" color="error" mt={2}>
          {errorMsg}
        </Typography>
      )}
      <Box mt={2}>
        <Typography variant="body2">
          Don't have an account?
          <Link
            component="button"
            sx={{ color: "white" }}
            variant="body2"
            onClick={navigateToSignUp}
          >
            SIGN UP
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
