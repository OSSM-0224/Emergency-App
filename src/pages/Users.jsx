import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import Header from "../components/Header";
import { rtdb } from "../firebase"; // 🔹 central instance
// Material UI imports
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

export default function Users() {
  /* ────────────────────────────
   * STATE
   * ────────────────────────── */
  const [usersData, setUsersData] = useState([]);
  const [search, setSearch] = useState("");
  /* ────────────────────────────
   * FIREBASE: real‑time listener
   * ────────────────────────── */
  useEffect(() => {
    const usersRef = ref(rtdb, "Users/");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([id, user]) => ({
          id,
          username: user.username || "N/A",
          email: user.email || "N/A",
          location: {
            lat: user.location?.latitude || "N/A",
            lng: user.location?.longitude || "N/A",
            time: user.location?.timestamp || "N/A",
          },
          contacts: Object.values(user.Contacts || []),
        }));

        setUsersData(parsed);
      }
    });
  }, []);

  /* ────────────────────────────
   * FILTER
   * ────────────────────────── */

  const filteredUsers = usersData.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Page header */}
      <Header
        icon={
          <img
            src="https://img.icons8.com/fluency/48/user-group-man-man.png"
            alt="Users"
            style={{ width: 48, height: 48 }}
          />
        }
      />

      {/* Search box */}
      <TextField
        label="Search by username or email"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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

      {/* Users grid OR empty state */}
      {filteredUsers.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No users found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((u) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={u.id}>
              <Card
                sx={{
                  background: "#1e293b",
                  color: "#f8fafc",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  height: "100%", // equal‑height cards
                  display: "flex",
                  flexDirection: "column",
                  border: "none",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Username + email */}
                  <Typography
                    variant="h6"
                    sx={{ color: "#60a5fa", mb: 0.5, fontWeight: 600 }}
                  >
                    {u.username}
                  </Typography>
                  <Typography sx={{ color: "#7dd3fc", mb: 1 }}>
                    {u.email}
                  </Typography>

                  {/* Location & timestamp */}
                  <Typography sx={{ color: "#cbd5e1", fontSize: 15 }}>
                    <strong>Timestamp:</strong>{" "}
                    {u.location.time && !isNaN(u.location.time)
                      ? new Date(u.location.time).toLocaleString()
                      : "N/A"}
                  </Typography>
                  <Typography sx={{ color: "#cbd5e1", fontSize: 15 }}>
                    <strong>Timestamp:</strong> {u.location.time}
                  </Typography>

                  {/* Divider */}
                  <Divider sx={{ my: 2, borderColor: "#334155" }} />

                  {/* Emergency contacts */}
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
                      📞Emergency Contacts:
                    </Typography>

                    {u.contacts?.length > 0 ? (
                      <List dense>
                        {u.contacts.map((c, i) => (
                          <ListItem key={i} disablePadding>
                            <ListItemText
                              primary={
                                <span
                                  style={{
                                    color: "#7dd3fc",
                                    fontWeight: 500,
                                  }}
                                >
                                  {c.name} | {c.phone} | Blood&nbsp;Group:&nbsp;
                                  {c.bloodGroup}
                                </span>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography sx={{ color: "#cbd5e1" }}>
                        <i>No contacts found.</i>
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
