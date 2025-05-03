import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Input, Typography, Link } from "@mui/material";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

export default function Signup() {
// TODO : add google auth for signup 
// Fix the google auth in login page
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const nav = useNavigate();

  const navigateToLogin = ()=> nav("/login"); ;

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

  const handleGoogleSignup = async (credentialResponse) =>{
    try{
      const decoded = jwtDecode(credentialResponse.credential);
      const {email, name} = decoded; 

      const response = await axios.post("http://localhost:4000/google-auth", {
        email, 
        username: name,
      });
      const data = response.data; 

      Cookies.set("token", data.token);
      Cookies.set("loginTime", JSON.stringify(Date.now()), { expires: 7 });
      Cookies.set("userEmail", data.email || email, { expires: 7 });
      Cookies.set("username", data.username, { expires: 7 });
      Cookies.set("userRole", data.role || "User", { expires: 7 });

      nav("/dashboard");

    }catch(err){
      console.error("Google Signup Failed", err);
      setMessage("Google Signup Failed. Please try again.");
    }
  };

  const handleGoogleError = ()=>{
    setMessage("Google Signup Failed. Please try again.");
  }

  return (
    <Box p={3} bgcolor={"background.paper"} boxShadow={1} borderRadius={2}>
      <Typography variant="h3">Sign Up</Typography>
      <Box component={"form"} onSubmit={signUpHandler}>
        <Box>
          <Typography variant="h5">Username:</Typography>
          <Input
            type="text"
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
          disabled={!username || !email || !password || !confirmPassword}
          variant="contained"
          color="primary"
          sx={{ color: "white", mt: 2 }}
          type="submit"
        >
          SIGN UP
        </Button>

        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Box mt={2}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Or Sign Up With Google
            </Typography>
            <GoogleLogin width={"200px"}
              onSuccess={handleGoogleSignup}
              onError={handleGoogleError}
            />

          </Box>
        </GoogleOAuthProvider>
      </Box>

      {message && (
        <Typography variant="body2" color="error" mt={2}>
          {message}
        </Typography>
      )}

      <Box mt={2}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", textDecoration: "none" }}
        >
          Already have an account ?
          <Link
            component="button"
            sx={{ color: "white" }}
            variant="body2"
            onClick={navigateToLogin}
          >
            LOGIN HERE
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
