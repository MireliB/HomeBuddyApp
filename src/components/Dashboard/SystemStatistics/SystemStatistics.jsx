import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";

export default function SystemStatistics({ isDarkMode, colors }) {
  return (

    <Box  style={{
      padding: "16px",
      backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
      borderRadius: "10px",
    }}>
    <Grid item xs={12}>
      <Box
        elevation={3}
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              Total Users
            </Typography>
            <Typography
              variant="h5"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              1,024
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              Active Devices
            </Typography>
            <Typography
              variant="h5"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              35
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              Rooms Monitored
            </Typography>
            <Typography
              variant="h5"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              10
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              Alerts Today
            </Typography>
            <Typography
              variant="h5"
              color={isDarkMode ? colors.greenAccent[500] : colors.primary[100]}
            >
              3
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Grid>


    </Box>
  );
}
