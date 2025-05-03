import { Box, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

export default function AlertsAndNotifications({
  isDarkMode,
  colors,
  rooms,
  devices,
}) {

  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [errorMsg, setErrorMsg] = useState();

  const fetchRoomsAndDevicesAlerts = async()=>{
    setLoading(true);

    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
      const response = await axios.get("http://localhost:4000/alerts", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setAlerts(response.data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setErrorMsg("Failed to fetch alerts...", err);
    }finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchRoomsAndDevicesAlerts();
  },[])

  const getAlertColor = (type) =>{
    switch(type) {
      case "delete":
        return colors.redAccent[400];
      case "update":
        return "orange";
      case "create":
        return colors.greenAccent[500];
      default:
        return isDarkMode ? colors.grey[100] : colors.grey[900];
      }
  }

  return (
    <Box
      style={{
        padding: "16px",
        backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
        borderRadius: "10px",
      }}
    >
      <Grid item xs={12}>
        <Box
          elevation={3}
          style={{
            padding: "16px",
            backgroundColor: isDarkMode
              ? colors.primary[400]
              : colors.grey[900],
            borderRadius: "10px",
            height: "218px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Alerts and Notifications
          </Typography>
          <Divider style={{ marginBottom: "16px" }} />
          <Stack spacing={2}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress color="secondary" />
              </Box>
            ) : alerts.length > 0 ? (
              alerts.map((alert) => (
                <Stack direction="row" alignItems="center" key={alert.id}>
                  <FiAlertCircle
                    style={{
                      color: getAlertColor(alert.type),
                      marginRight: "8px",
                    }}
                  />

                  <Typography
                    color={
                      isDarkMode ? colors.greenAccent[500] : colors.primary[100]
                    }
                  >
                    {alert.message}
                  </Typography>
                </Stack>
              ))
            ) : (
              <Typography
                color={
                  isDarkMode ? colors.greenAccent[500] : colors.primary[100]
                }
              >
                No alerts at the moment.
              </Typography>
            )}
          </Stack>
        </Box>
      </Grid>
    </Box>
  );
}
