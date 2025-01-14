import { Box, useTheme, Typography } from "@mui/material";
import React from "react";
import { tokens } from "../Theme";
import ProgressCircle from "./ProgressCircle";

export default function StatBox({ title, subtitle, icon, progress }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m={"0 30px"}>
      <Box display="flex" alignItems="center" >
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight={" bold"}
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>

        <Box mt={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {progress !== undefined && <ProgressCircle progress={progress} />}
        </Box>
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle={"italic"}
          sx={{ color: colors.greenAccent[600] }}
        >
        </Typography>
      </Box>
    </Box>
  );
}
