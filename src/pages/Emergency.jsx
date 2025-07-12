/**
 * Emergency.jsx –Admin dashboard page listing live SOS alerts
 * -----------------------------------------------------------------------------
 * Key additions in this version:
 *   1. Blood‑group badge (red pill) shown on the right‑hand side of each card
 *   2. Conditional rendering so badge is hidden if blood group is “Not provided”
 *   3. Detailed comments (per your request) explaining why each part exists
 */

import { useEffect, useState } from "react";
import {
  ref,
  get,
  onValue,
  update,
  push,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "../firebase";
import { MapPin } from "lucide-react";
import Header from "../components/Header";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export default function Emergency() {
  /* ------------------------------------------------------------------------
   * STATE
   * ---------------------------------------------------------------------- */
  // List of merged, enriched SOS alerts
  const [alerts, setAlerts] = useState([]);

  // Search input value (filters by name, blood group, destination)
  const [searchTerm, setSearchTerm] = useState("");

  /* ------------------------------------------------------------------------
   * EFFECT: Real‑time listener on "sos_alerts"
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    const alertsRef = ref(rtdb, "sos_alerts");

    // Listen continuously for changes
    onValue(alertsRef, async (snapshot) => {
      console.log("SOS snapshot:", snapshot.val());
      const data = snapshot.val();
      if (!data) return setAlerts([]); // No alerts: clear list

      // Convert object → array of [id, alert]
      const alertEntries = Object.entries(data);

      // Merge each alert with user + profile info (if available)
      const mergedAlerts = await Promise.all(
        alertEntries.map(async ([id, alert]) => {
          const uid = alert.uid || null;
          let userData = {};
          let profileData = {};

          if (uid) {
            try {
              // Extra user info in /users
              const userSnap = await get(ref(rtdb, `users/${uid}`));
              if (userSnap.exists()) userData = userSnap.val();

              // Extra profile info in /Users (capital U)
              const profileSnap = await get(ref(rtdb, `Users/${uid}`));
              if (profileSnap.exists()) profileData = profileSnap.val();
            } catch (err) {
              console.error("Error fetching user/profile data:", err);
            }
          }

          /* Return one merged object per alert. Any field that might be
           * missing falls back to "N/A" or a sensible default.
           */
          return {
            id,
            uid,
            name: alert.name || profileData.username || "N/A",
            email: profileData.email || "N/A",
            bloodGroup:
              alert.blood_group || userData.bloodGroup || "Not provided",
            destination: alert.destination || userData.destination || "N/A",
            companions:
              alert.companions || userData.companions?.split(",") || [],
            family: alert.family_members || userData.family?.split(",") || [],
            location: {
              lat: alert.latitude || profileData.location?.latitude || "N/A",
              lng: alert.longitude || profileData.location?.longitude || "N/A",
              timestamp: alert.timestamp || profileData.location?.timestamp,
            },
            resolved: alert.resolved || false,
          };
        })
      );

      // Most recent first
      setAlerts(mergedAlerts.reverse());
    });
  }, []);

  /* ------------------------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------------------- */
  // Mark specific alert as resolved in RTDB
  const handleMarkResolved = async (alertObj) => {
    const { id } = alertObj;

    // 1. Mark as resolved in original alert
    const alertRef = ref(rtdb, `sos_alerts/${id}`);
    await update(alertRef, {
      resolved: true,
      resolvedAt: serverTimestamp(),
    });

    // 2. Push a copy to /resolved_alerts (immutable history)
    const resolvedRef = ref(rtdb, "resolved_alerts");
    await push(resolvedRef, {
      ...alertObj,
      resolved: true,
      resolvedAt: serverTimestamp(),
    });
  };

  // Simple client‑side text filter
  const filteredAlerts = alerts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ------------------------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------------------- */
  return (
    <Box
      sx={{
        /** CENTRE + MAX WIDTH **/
        maxWidth: 1200, // wider than Users page
        mx: "auto",

        /** RESPONSIVE PADDING  (xs|sm|md) **/
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* ───────────────── Header + Search ───────────────── */}
      <Header
        icon={
          <img
            src="https://img.icons8.com/fluency/48/alarm.png"
            alt="Emergency"
            style={{ width: 48, height: 48 }}
          />
        }
      />

      <TextField
        fullWidth
        label="Search by name, blood group, or destination"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          input: { color: "#f8fafc" },
          label: { color: "#60a5fa" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#60a5fa",
            },
            "&:hover fieldset": {
              borderColor: "#60a5fa",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#60a5fa",
            },
          },
        }}
      />

      {/* ───────────────── Alerts list ───────────────── */}
      {filteredAlerts.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No matching emergency requests.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredAlerts.map((a) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={a.id}>
              <Card
                sx={{
                  background: "#1e293b",
                  color: "#f8fafc",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  height: "100%", // cards equal height
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header: name + blood badge */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "#60a5fa", fontWeight: 600 }}
                    >
                      {a.name}
                    </Typography>

                    {a.bloodGroup !== "Not provided" && (
                      <Box
                        component="span"
                        sx={{
                          background: "#dc2626",
                          color: "#fff",
                          px: 1.25,
                          py: "2px",
                          borderRadius: 9999,
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          letterSpacing: 0.5,
                        }}
                      >
                        {a.bloodGroup.toUpperCase()}
                      </Box>
                    )}
                  </Box>

                  {/* Details list */}
                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Email:</strong> {a.email}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Destination:</strong> {a.destination}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Companions:</strong>{" "}
                    {a.companions.join(", ") || "N/A"}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Family:</strong> {a.family.join(", ") || "N/A"}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Location:</strong> {a.location.lat},{" "}
                    {a.location.lng}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1" }}>
                    <strong>Time:</strong>{" "}
                    {a.location.timestamp
                      ? new Date(a.location.timestamp).toLocaleString()
                      : "N/A"}
                  </Typography>
                </CardContent>

                {/* Button bar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1.5,
                    pt: 0,
                  }}
                >
                  <Button
                    href={`https://www.google.com/maps/search/?api=1&query=${a.location.lat},${a.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<MapPin size={16} />}
                    sx={{
                      color: "#60a5fa",
                      textTransform: "none",
                      "&:hover": { bgcolor: "rgba(96,165,250,0.1)" },
                    }}
                  >
                    ViewonMap
                  </Button>

                  {!a.resolved ? (
                    <Button
                      size="small"
                      onClick={() => handleMarkResolved(a)} // pass full object
                      sx={{
                        color: "#22c55e",
                        textTransform: "none",
                        "&:hover": { bgcolor: "rgba(34,197,94,0.1)" },
                      }}
                    >
                      MarkResolved
                    </Button>
                  ) : (
                    <Typography sx={{ color: "#22c55e", fontWeight: 600 }}>
                      ✅Resolved
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
