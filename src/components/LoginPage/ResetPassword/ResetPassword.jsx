import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/reset-password/${token}`, {
        password,
      });
      setMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
      setMessage("");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5">Reset Password</Typography>
      <TextField
        fullWidth
        type="password"
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleReset} sx={{ mt: 2 }}>
        Reset Password
      </Button>
      {message && <Typography sx={{ mt: 2, color: "green" }}>{message}</Typography>}
      {error && <Typography sx={{ mt: 2, color: "red" }}>{error}</Typography>}
    </Box>
  );
}
