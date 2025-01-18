import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'

export default function AlertsAndNotifications({isDarkMode, colors}) {
  return (
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
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={"bold"}>
        Alerts and Notifications
      </Typography>
      <Divider style={{ marginBottom: "16px" }} />
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center">
          <FiAlertCircle style={{ color: "red", marginRight: "8px" }} />
          <Typography
            color={
              isDarkMode ? colors.greenAccent[500] : colors.primary[100]
            }
          >
            Kitchen Sensor Disconnected
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <FiAlertCircle
            style={{ color: "orange", marginRight: "8px" }}
          />
          <Typography
            color={
              isDarkMode ? colors.greenAccent[500] : colors.primary[100]
            }
          >
            Living Room Light Overload
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <FiAlertCircle style={{ color: "green", marginRight: "8px" }} />
          <Typography
            color={
              isDarkMode ? colors.greenAccent[500] : colors.primary[100]
            }
          >
            Bedroom Thermostat Updated
          </Typography>
        </Stack>
      </Stack>
    </Box>
  </Grid>
  )
}
