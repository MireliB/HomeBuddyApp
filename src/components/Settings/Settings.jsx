import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import { MenuItem } from "react-pro-sidebar";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  useTheme,
  Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { ColorModeContext } from "../../Theme";
import Header from "../Header";

export default function Settings() {
  const theme = useTheme(); 
  const colorMode = useContext(ColorModeContext); 
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(Cookies.get("language") || "en");
 
  const handleLanguageChange = (e)=>{
    const newLanguage = e.target.value; 
    setLanguage(newLanguage);

    Cookies.set("language", newLanguage);
    i18n.changeLanguage(newLanguage);
  }

  return (
    <Box m={2}>
    <Header title={t("settings.title")} subtitle={t("settings.subtitle")} />
    <Box sx={{ mt: 4, px: 3, py: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6">{t("settings.title")}</Typography>
      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={
          <Switch
            checked={theme.palette.mode === "dark"}
            onChange={colorMode.toggleColorMode}
          />
        }
        label={t("settings.darkMode")}
      />

      <Box mt={2}>
        <Typography gutterBottom>{t("settings.language")}</Typography>
        <Select value={language} onChange={handleLanguageChange} sx={{ width: 200 }}>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="he">עברית</MenuItem>
          <MenuItem value="ru">Русский</MenuItem>
          <MenuItem value="ar">العربية</MenuItem>
        </Select>
      </Box>
    </Box>
  </Box>
  );
}
