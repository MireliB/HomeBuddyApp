import React, { useState } from "react";

import { Box, Button, Input, Link, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import "./Login.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const navigateToSignUp = () => nav("/signup");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(""); 
    setLoading(true); 

    if(!formData.email || !formData.password){
      setErrorMsg("Email and Password are required");
      setLoading(false);
      return;
    }

    try{
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if(!response.ok){
        const data = await response.json();
        setErrorMsg(data.message || "Failed to login. Please try again");
        setLoading(false);
        return; 
      }
      const data = await response.json();

        Cookies.set("token", data.token);
        Cookies.set("loginTime", JSON.stringify(Date.now()), { expires: 7 });
        Cookies.set("userEmail", email, { expires: 7 });

        onLogin(formData.email);
        nav("/dashboard");
    }catch(err){
      setErrorMsg("An error occured. Please try again");
    }finally{
      setLoading(false);
    }

    // await fetch("http://localhost:4000/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password }),
    // })
      // .then((response) => {
      //   if (!response.ok) {
      //     return response.json().then((data) => {
      //       setErrorMsg(data.message || "Failed to login. Please try again");
      //     });
      //   }
      //   return response.json();
      // })
      // .then((data) => {
      //   console.log("Login Response: ", data);

      //   Cookies.set("token", data.token);
      //   Cookies.set("loginTime", JSON.stringify(Date.now()), { expires: 7 });
      //   Cookies.set("userEmail", email, { expires: 7 });

      //   onLogin(email);
      //   nav("/dashboard");
      // })
      // .finally(() => {
      //   setLoading(false);
      // });
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
