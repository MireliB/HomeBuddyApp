import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import React from 'react'

export default function QuickActions({isDarkMode, colors}) {
  return (
    <Box  style={{
      padding: "16px",
      backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
      borderRadius: "10px",
    }}>
    <Grid item xs={12} md={4}>
    <Box
      elevation={3}
      style={{
        padding: "16px",
        backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
        borderRadius: "10px",
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={"bold"}>
        Quick Actions
      </Typography>
      <Divider style={{ marginBottom: "16px" }} />
      <Stack spacing={2}>
        <Button variant="contained" color="primary">
          Add New Room
        </Button>
        <Button variant="contained" color="secondary">
          Add New Device
        </Button>
        <Button variant="contained" color="error">
          View Alerts
        </Button>
      </Stack>
    </Box>
  </Grid>  

    </Box>
  )
}
