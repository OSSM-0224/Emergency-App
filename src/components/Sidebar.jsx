import { NavLink } from "react-router-dom";
import {
  Box, Typography, List, ListItem, ListItemIcon, ListItemText, Badge, Drawer, IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ emergencyAlert }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/", icon: <AssessmentIcon /> },
    { label: "Users", path: "/users", icon: <PeopleAltIcon /> },
    {
      label: "Emergency",
      path: "/emergency",
      icon: (
        <Badge
          color="error"
          variant={emergencyAlert ? "dot" : "standard"}
          overlap="circular"
        >
          <WarningIcon />
        </Badge>
      ),
    },
    { label: "Emergency Info", path: "/emergencyinfo", icon: <InfoIcon /> },
    { label: "Reports", path: "/reports", icon: <AssessmentIcon /> },
    { label: "Notifications", path: "/notification", icon: <NotificationsIcon /> },
    { label: "Logout", path: "/logout", icon: <LogoutIcon /> },
  ];

  const sidebarContent = (
    <Box
      sx={{
        width: 230,
        minHeight: "100vh",
        background: "#1e293b",
        color: "#f8fafc",
        py: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#60a5fa",
          fontWeight: 700,
          mb: 4,
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        Admin Panel
      </Typography>
      <List>
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.label}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#60a5fa" : "#f8fafc",
              background: isActive ? "#0f172a" : "transparent",
              borderRadius: 8,
              marginBottom: 6,
              display: "block",
            })}
            onClick={() => setMobileOpen(false)}
          >
            <ListItem button sx={{ py: 1.2 }}>
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Hamburger icon for mobile */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => setMobileOpen(true)}
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          background: "#1e293b",
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Permanent sidebar for desktop */}
      <Box
        sx={{
          width: 230,
          minHeight: "100vh",
          background: "#1e293b",
          color: "#f8fafc",
          py: 4,
          px: 2,
          boxShadow: "2px 0 12px rgba(16,30,54,0.10)",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 100,
          display: { xs: "none", md: "block" },
        }}
      >
        {sidebarContent}
      </Box>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            background: "#1e293b",
            color: "#f8fafc",
            width: 230,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
