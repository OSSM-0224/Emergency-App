// src/pages/EmergencyInfo.jsx
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

// ───── Material‑UI imports ─────
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import Header from "../components/Header";

export default function EmergencyInfo() {
  /* ────────────────────────────
   * STATE
   * ────────────────────────── */
  const [userInfos, setUserInfos] = useState([]);

  /* ────────────────────────────
   * FIREBASE LISTENER
   * ────────────────────────── */
  useEffect(() => {
    const refUsers = ref(rtdb, "users/");
    onValue(refUsers, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setUserInfos([]);

      const parsed = Object.entries(data).map(([id, user]) => ({
        id,
        address: user?.address || "N/A",
        bloodGroup: user?.bloodGroup || "N/A",
        companions: user?.companions || "N/A",
        destination: user?.destination || "N/A",
        family: user?.family || "N/A",
        emergencyItems: user?.emergencyItems || null,
      }));
      setUserInfos(parsed);
    });
  }, []);

  /* ────────────────────────────
   * RENDER
   * ────────────────────────── */
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Header
        icon={
          <img
            src="https://img.icons8.com/fluency/48/info.png"
            alt="Emergency Info"
            style={{ width: 48, height: 48 }}
          />
        }
      />

      {userInfos.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No user emergency info available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {userInfos.map((u) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={u.id}>
              <Card
                sx={{
                  background: "#1e293b",
                  color: "#f8fafc",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* -------- Basic details -------- */}
                  <Typography
                    variant="h6"
                    sx={{ color: "#60a5fa", fontWeight: 600, mb: 1 }}
                  >
                    {u.address}
                  </Typography>

                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Blood             +Group:</strong> {u.bloodGroup}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Companions:</strong> {u.companions}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1", mb: 0.5 }}>
                    <strong>Destination:</strong> {u.destination}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1" }}>
                    <strong>Family:</strong> {u.family}
                  </Typography>

                  {/* Divider */}
                  <Divider sx={{ my: 2, borderColor: "#334155" }} />

                  {/* -------- Emergency kit -------- */}
                  <Box
                    sx={{
                      background: "#0f172a",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#60a5fa", mb: 1 }}
                    >
                      🧰Emergency Kit Items:
                    </Typography>

                    {u.emergencyItems ? (
                      <List dense>
                        {Object.entries(u.emergencyItems).map(
                          ([item, quantity]) => (
                            <ListItem key={item} disablePadding>
                              <ListItemText
                                primary={
                                  <span
                                    style={{
                                      color: "#7dd3fc",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {item}: {quantity}
                                  </span>
                                }
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    ) : (
                      <Typography sx={{ color: "#cbd5e1" }}>
                        <i>No emergency items listed.</i>
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
