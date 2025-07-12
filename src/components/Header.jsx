// src/components/Header.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";

// Route-wise icons and subtitles
const pageMeta = {
  "/": {
    icon: (
      <img
        src="https://img.icons8.com/fluency/48/user-group-man-man.png"
        alt="Dashboard"
        style={{ width: 44, height: 44 }}
      />
    ),
    title: "Admin Dashboard",
    subtitle: "Welcome! Monitor users, locations, and emergencies in real-time.",
  },
  "/users": {
    icon: (
      <img
        src="https://img.icons8.com/fluency/48/user-group-man-man.png"
        alt="Users"
        style={{ width: 44, height: 44 }}
      />
    ),
    title: "Users List",
    subtitle: "All registered users with details and contacts.",
  },
  "/emergency": {
    icon: (
      <img
        src="https://img.icons8.com/fluency/48/alarm.png"
        alt="Emergency"
        style={{ width: 44, height: 44 }}
      />
    ),
    title: "Emergency Requests",
    subtitle: "Live emergency alerts and actions.",
  },
  "/emergencyinfo": {
    icon: (
      <img
        src="https://img.icons8.com/fluency/48/info.png"
        alt="Emergency Info"
        style={{ width: 44, height: 44 }}
      />
    ),
    title: "Emergency Info",
    subtitle: "Detailed information about emergency protocols.",
  },
  "/reports": {
    icon: (
      <img
        src="https://img.icons8.com/fluency/48/combo-chart.png"
        alt="Reports"
        style={{ width: 44, height: 44 }}
      />
    ),
    title: "Reports",
    subtitle: "View and analyze system reports.",
  },
  "/notification": {
    icon: (
      <img
        src="https://img.icons8.com/fluency/48/appointment-reminders.png"
        alt="Notifications"
        style={{ width: 44, height: 44 }}
      />
    ),
    title: "Notifications",
    subtitle: "All recent alerts and notifications.",
  },
  "/logout": {
    icon: (
      <img
        src="https://img.icons8.com/fluency/48/logout-rounded-left.png"
        alt="Logout"
        style={{ width: 44, height: 44 }}
      />
    ),
    title: "Logout",
    subtitle: "Sign out from the admin panel.",
  },
};

export default function Header(props) {
  const location = useLocation();
  const meta = pageMeta[location.pathname] || {
    icon: <span style={{ fontSize: 44 }}>📄</span>,
    title: "Page",
    subtitle: "",
  };

  // Allow override via props if needed
  const icon = props.icon || meta.icon;
  const title = props.title || meta.title;
  const subtitle = props.subtitle || meta.subtitle;

  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #1e293b 60%, #60a5fa 100%)",
        borderRadius: "18px",
        p: { xs: 2, md: 4 },
        mb: { xs: 2, md: 4 },
        boxShadow: "0 4px 18px rgba(16,30,54,0.18)",
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, md: 2 },
        flexDirection: { xs: "column", sm: "row" },
        textAlign: { xs: "center", sm: "left" },
        px: { xs: 1, sm: 2, md: 4 },
        maxWidth: { xs: "100%", md: 700 },
        mx: "auto",
        mt: { xs: 2, md: 4 },
      }}
    >
      {icon}
      <Box>
        <Typography
          variant="h3"
          sx={{
            color: "#7dd3fc",
            fontWeight: 700,
            letterSpacing: 1,
            mb: 0.5,
            fontSize: { xs: 28, md: 36 },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: "#cbd5e1", fontSize: 18 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
