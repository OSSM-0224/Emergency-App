import { useEffect, useState } from "react";
import Header from "../components/Header";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from "@mui/material";

export default function Reports() {
  const [resolvedAlerts, setResolvedAlerts] = useState([]);

  useEffect(() => {
    const alertsRef = ref(rtdb, "sos_alerts");
    onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setResolvedAlerts([]);
      // Filter only resolved alerts
      const resolved = Object.entries(data)
        .filter(([, alert]) => alert.resolved)
        .map(([id, alert]) => ({
          id,
          username: alert.name || alert.username || "N/A",
          email: alert.email || "N/A",
          status: alert.resolved ? "Resolved" : "Pending",
          location: alert.latitude && alert.longitude
            ? `${alert.latitude}, ${alert.longitude}`
            : "N/A",
          message: alert.relativesNotified
            ? "Message sent to relatives"
            : "Not sent to relatives",
        }));
      setResolvedAlerts(resolved.reverse());
    });
  }, []);

  return (
    <div>
      <Header
        icon={
          <img
            src="https://img.icons8.com/fluency/48/combo-chart.png"
            alt="Reports"
            style={{ width: 48, height: 48 }}
          />
        }
      />
      <Box
        className="dashboard"
        sx={{
          px: { xs: 1, sm: 2, md: 4 }, // Responsive horizontal padding
          maxWidth: { xs: "100%", md: 700 },
          mx: "auto",
          mt: { xs: 2, md: 4 },
        }}
      >
        <div style={{ marginTop: 40 }}>
          <Typography variant="h5" sx={{ color: "#60a5fa", mb: 2, textAlign: "center" }}>
            Resolved Emergency Requests
          </Typography>
          <TableContainer component={Paper} sx={{ background: "#1e293b", borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#7dd3fc" }}>Username</TableCell>
                  <TableCell sx={{ color: "#7dd3fc" }}>Email</TableCell>
                  <TableCell sx={{ color: "#7dd3fc" }}>Status</TableCell>
                  <TableCell sx={{ color: "#7dd3fc" }}>Location</TableCell>
                  <TableCell sx={{ color: "#7dd3fc" }}>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resolvedAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ color: "#cbd5e1", textAlign: "center" }}>
                      No resolved emergencies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  resolvedAlerts.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ color: "#f8fafc" }}>{row.username}</TableCell>
                      <TableCell sx={{ color: "#cbd5e1" }}>{row.email}</TableCell>
                      <TableCell sx={{ color: "#22c55e", fontWeight: 600 }}>{row.status}</TableCell>
                      <TableCell sx={{ color: "#cbd5e1" }}>{row.location}</TableCell>
                      <TableCell sx={{ color: row.message.includes("sent") ? "#22c55e" : "#f43f5e" }}>
                        {row.message}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </div>
  );
}