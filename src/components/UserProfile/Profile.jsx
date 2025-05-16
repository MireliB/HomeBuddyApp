import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import axios from "axios";

export default function Profile({
  username,
  setUsername,
  userEmail,
  setUserEmail,
  userRole,
  setUserRole,
}) {
  const { userId } = useParams();
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await axios.get(
        `http://localhost:4000/users/${userId}`,
        {
          headers: {
            Authotization: `Bearer ${token}`,
          },
        }
      );
      setUsername(response.json());
    } catch (err) {
      console.error("Error fetching User data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <CircularProgress />;
  if (!username) return <Typography>User not found</Typography>;
  return (
    <Box p={2}>
      <Header
        title={"Profile"}
        subtitle={"Detaild Information About User Profile"}
      />
      <Paper sx={{ p: 3, display: "flex", gap: 3 }}>
        <Avatar sx={{ width: 80, height: 80 }}>{username}</Avatar>

        <Box>
          <Typography variant="h6">{username}</Typography>
          <Typography>Email: {userEmail}</Typography>
          <Typography>Role: {userRole}</Typography>
          {/* soon add here active/inactive */}
        </Box>
      </Paper>

      <Divider />
      <br />
      <Box display={"flex"} gap={2}>
        <Button variant="contained" color="primary">
          Edit
        </Button>
        <Button variant="outlined" color="error">
          Delete
        </Button>
      </Box>
    </Box>
  );
}
