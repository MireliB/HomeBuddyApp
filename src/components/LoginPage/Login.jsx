import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Box, Button, Input, Link, Typography, useTheme } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../Theme";
import Cookies from "js-cookie";

import "./Login.css";
import { auth, provider, signInWithPopup } from "../../firebase/firebaseConfig";

// add google auth for login also
export default function Login({ onLogin }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const nav = useNavigate();

  const navigateToSignUp = () => nav("/signup");

  const navigateToForgotPassword = () => nav("/signup");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setErrorMsg("Email and Password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();

        setErrorMsg(data.message || "Failed to login. Please try again");
        setLoading(false);
        return;
      }

      const data = await response.json();

      Cookies.set("token", data.token);
      Cookies.set("loginTime", JSON.stringify(Date.now()), { expires: 7 });
      Cookies.set("userEmail", data.email || formData.email, { expires: 7 });
      Cookies.set("username", data.username || formData.username, {
        expires: 7,
      });

      onLogin(formData.email, formData.username);
      nav("/dashboard");
    } catch (err) {
      setErrorMsg("An error occured. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const responseMessage = (response) => {
    console.log(response);
  };

  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <Box
      className="login-wrapper"
      sx={{ backgroundColor: colors.greenAccent[500] }}
    >
      <Typography variant="h3" sx={{ fontWeight: "bold" }}>
        Admin
      </Typography>{" "}
      <br />
      <Box component={"form"} onSubmit={handleLogin}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Username
          </Typography>
          <Input
            type="username"
            name="username"
            placeholder="example111"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Email
          </Typography>
          <Input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Password
          </Typography>
          <Input
            type="password"
            name="password"
            placeholder="*********"
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

        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </GoogleOAuthProvider>

      </Box>
      {errorMsg && (
        <Typography variant="body2" color="error" mt={2}>
          {errorMsg}
        </Typography>
      )}
      <Box mt={2}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Don't have an account ?
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
      <Box mt={2}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", textDecoration: "none" }}
        >
          <Link
            component="button"
            sx={{ color: "white" }}
            variant="body2"
            onClick={navigateToForgotPassword}
          >
            FORGOT YOUR PASSWORD ?
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
