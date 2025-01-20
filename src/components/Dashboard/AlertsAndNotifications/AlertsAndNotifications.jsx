import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import axios from 'axios';
import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'

export default function AlertsAndNotifications({
  isDarkMode,
  colors,
  rooms,
  devices,
}) {

  const alerts = [
    ...rooms.map((room) => ({
      id: `room-${room._id}`,
      message: `${room.name} Was Currently Updated`,
      severity: "green",
    })),
    ...devices.map((device) => ({
      id: `room-${device._id}`,
      message: `${device.name} Is Currently ${
        device.status === "On" ? "Turned On" : "Turned Off"
      }`,
      severity: "orange",
    })),
  ];

  // make here api request for alerts and statuses from backend
  const fetchRoomsAndDevicesAlerts = async()=>{
    // const response = await axios.get()
  }

  return (
    <Grid item xs={12}>
      <Box
        elevation={3}
        style={{
          padding: '16px',
          backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
          borderRadius: '10px',
          height: '218px',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Alerts and Notifications
        </Typography>
        <Divider style={{ marginBottom: '16px' }} />
        <Stack spacing={2}>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <Stack direction="row" alignItems="center" key={alert.id}>
                <FiAlertCircle
                  style={{
                    color: alert.severity,
                    marginRight: '8px',
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
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              No Alerts at the Moment
            </Typography>
          )}
        </Stack>
      </Box>
    </Grid>
  );
}
