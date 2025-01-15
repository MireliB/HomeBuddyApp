import { Box, useTheme, Typography } from "@mui/material";
import React from "react";
import { tokens } from "../Theme";
import ProgressCircle from "./ProgressCircle";

export default function StatBox({ title, subtitle, icon, progress }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box width="100%" m={"0 30px"}>
      <Box display="flex" alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {icon}
          <Typography
            gutterBottom
            variant="h4"
            fontWeight={" bold"}
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>

        <Box mt={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {progress !== undefined && <ProgressCircle progress={progress} />}
          </Box>
        </Box>
        
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Typography
          variant="h5"
          color={
            isDarkMode ? colors.greenAccent[500] : colors.primary[100]
          }
          gutterBottom
        >
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle={"italic"}
          sx={{ color: colors.greenAccent[600] }}
        ></Typography>
      </Box>
    </Box>
  );
}
