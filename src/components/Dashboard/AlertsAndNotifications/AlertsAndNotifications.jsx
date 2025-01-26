import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
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

  // make here api request for alerts and statuses from backend
  const fetchRoomsAndDevicesAlerts = async()=>{
    setLoading(true);

    try {
      
    
    } catch (err) {
      setErrorMsg("error showing alerts...", err);
    }
  }

  useEffect(()=>{
    fetchRoomsAndDevicesAlerts();
  },[])

  return (
    <Grid item xs={12}>
      <Box
        elevation={3}
        style={{
          padding: "16px",
          backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
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
            <Typography
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              Loading Alerts...
            </Typography>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => (
              <Stack direction="row" alignItems="center" key={alert.id}>
                <FiAlertCircle
                  style={{
                    color: alert.severity,
                    marginRight: "8px",
                  }}
                />
                <Typography
                  color={
                    isDarkMode
                      ? colors.greenAccent[500]
                      : colors.primary[100]
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
              No Alerts at the Moment
            </Typography>
          )}
        </Stack>
      </Box>
    </Grid>
  );
}
