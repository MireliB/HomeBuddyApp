import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";

export default function SystemStatistics({ isDarkMode, colors, stats }) {
  return (

    <Box  style={{
      padding: "16px",
      backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
      borderRadius: "10px",
    }}>
    <Grid item xs={12}>
      <Box
        style={{
          padding: "16px",
          backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
          borderRadius: "10px",
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight={"bold"}>
          System Statistics
        </Typography>
        <Divider style={{ marginBottom: "16px" }} />
        <Stack spacing={2}>
          {[
            {label: "Total Users", value: stats.totalUsers},
            {label: "Active Devices", value: stats.activeDevices},
            {label: "Rooms Monitored", value: stats.roomsMonitored},
            {label: "Alerts Today", value: stats.alertsToday},
            
          ].map(({label, value})=>(
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              key={label}
            >
              <Typography
                variant="subtitle1"
                color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
              >
                {label}
              </Typography>
              <Typography
                variant="h5"
                color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
              >
                {value}
              </Typography>
            </Box>
          ))}   
        </Stack>
      </Box>
    </Grid>
    </Box>
  );
}
