import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickActions({isDarkMode, colors}) {
  const nav = useNavigate(); 

  const scrollToAlerts = ()=>{
    const alertsSection = document.getElementById("alerts-section");
    if(alertsSection){
      alertsSection.scrollIntoView({behavior: "smooth"});
    }
  }
  return (
    <Box
      style={{
        padding: "16px",
        backgroundColor: isDarkMode
          ? colors.primary[400]
          : colors.grey[900],
        borderRadius: "10px",
      }}
    >
      <Grid item xs={12} md={4}>
        <Box
          elevation={3}
          style={{
            padding: "16px",
            backgroundColor: isDarkMode
              ? colors.primary[400]
              : colors.grey[900],
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={"bold"}>
            Quick Actions
          </Typography>
          <Divider style={{ marginBottom: "16px" }} />
          <Stack spacing={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: colors.greenAccent[600] }}
              onClick={() => nav("/addRoom")}
            >
              Add New Room
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: colors.blueAccent[600] }}
              onClick={() => nav("/clients")}
            >
              Move To Clients
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => nav("/notifications")}
            >
              View Notifications
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Box>
  )
}
