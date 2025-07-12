// ──────────────────────────────────────────────────────────────
// src/pages/Home.jsx  ✅ CLEAN & WORKING
// ──────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { ref, onValue } from "firebase/database";   // 🔹 direct from SDK
import { rtdb }         from "../firebase";         // 🔹 central instance

import PeopleIcon     from "@mui/icons-material/People";
import PlaceIcon      from "@mui/icons-material/Place";
import OpacityIcon    from "@mui/icons-material/Opacity";
import TimelineIcon   from "@mui/icons-material/Timeline";
import MapIcon        from "@mui/icons-material/Map";
import CallIcon       from "@mui/icons-material/Call";
import TableChartIcon from "@mui/icons-material/TableChart";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  Box,
  Paper,
  Table,
  TableContainer,
} from "@mui/material";

import Header from "../components/Header";
import "./Home.css";   // CSS as-is

/* ────────────── constants ────────────── */
const COLORS = ["#0ea5e9", "#f43f5e", "#8b5cf6", "#10b981", "#f59e0b"];

/* ────────────────────────────────────────
   Component
─────────────────────────────────────────*/
export default function Home() {
  const [callStats,        setCallStats]   = useState([]);
  const [efficiencyStats,  setEfficiency]  = useState([]);
  const [totalUsers,       setTotalUsers]  = useState(0);
  const [topLocations,     setTopLocations]= useState([]);
  const [bloodGroupStats,  setBloodStats]  = useState([]);
  const [userMarkers,      setUserMarkers] = useState([]);

  /* ─── Firebase listener ─── */
  useEffect(() => {
    const usersRef = ref(rtdb, "Users");        // no trailing slash
    console.log("⏳ Listening to", usersRef);

    const off = onValue(
      usersRef,
      (snap) => {
        if (!snap.exists()) {
          console.warn("No Users data");
          return;
        }

        const data = snap.val();
        setTotalUsers(Object.keys(data).length);

        const locs   = [];
        const groups = {};
        const marks  = [];
        const slotData = Object.entries(data).map(([, user]) => {
          const src  = user.address     || "Unknown";
          const dest = user.destination || "Unknown";
          locs.push(`${src} → ${dest}`);

          const bg = user.bloodGroup || "Unknown";
          groups[bg] = (groups[bg] || 0) + 1;

          if (user.location?.latitude && user.location?.longitude) {
            marks.push({
              lat:  user.location.latitude,
              lng:  user.location.longitude,
              name: user.username || "Unknown",
              destination: dest,
            });
          }

          // 🔸 mock call stats (replace with real later)
          return {
            time: dest.slice(0, 5) || "N/A",
            Police: Math.floor(Math.random() * 50),
            Fire:   Math.floor(Math.random() * 30),
            Rescue: Math.floor(Math.random() * 20),
          };
        });

        setUserMarkers(marks);
        setTopLocations([...new Set(locs)].slice(0, 3));
        setBloodStats(Object.entries(groups).map(([n, v]) => ({ name: n, value: v })));
        setCallStats(slotData);

        setEfficiency([
          { subject: "Availability", A: 90 },
          { subject: "Supplies",     A: 80 },
          { subject: "Saved People", A: 70 },
          { subject: "Time",         A: 85 },
        ]);
      },
      (err) => console.error("onValue error →", err)
    );

    return () => off();                      // cleanup on unmount
  }, []);

  /* ─── UI ─── */
  return (
    <Box className="dashboard">
      <Header />

      {/* ── Top stat cards ── */}
      <div className="grid-cards">
        <div className="card">
          <h4><PeopleIcon /> Total Users</h4>
          <p>{totalUsers}</p>
        </div>

        <div className="card">
          <h4><PlaceIcon /> User Routes</h4>
          <ul>
            {topLocations.map((loc, idx) => (
              <li key={idx}>{loc}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h4><OpacityIcon /> Top Blood Groups</h4>
          <ul>
            {bloodGroupStats.slice(0, 3).map((bg) => (
              <li key={bg.name}>{bg.name}: {bg.value}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Middle row: charts + map ── */}
      <div className="mid-layout">
        {/* Left stack */}
        <div className="left-stack">
          <div className="section">
            <h3><TimelineIcon /> Efficiency</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={efficiencyStats}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="section">
            <h3><OpacityIcon /> Blood Group Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bloodGroupStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {bloodGroupStats.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map panel */}
        <div className="map-panel">
          <h3><MapIcon /> User Location Map</h3>
          <MapContainer
            center={[19.076, 72.8777]}
            zoom={10}
            className="leaflet-map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {userMarkers.map((m, idx) => (
              <Marker key={idx} position={[m.lat, m.lng]}>
                <Popup>
                  <b>{m.name}</b><br />
                  Destination: {m.destination}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* ── Call stats ── */}
      <div className="section">
        <h3><CallIcon /> Received Calls</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={callStats}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="Police" stackId="1" stroke="#0ea5e9"  fill="#0ea5e9" />
            <Area type="monotone" dataKey="Fire"   stackId="1" stroke="#f43f5e"  fill="#f43f5e" />
            <Area type="monotone" dataKey="Rescue" stackId="1" stroke="#8b5cf6"  fill="#8b5cf6" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── User table placeholder ── */}
      <div className="section">
        <h3><TableChartIcon /> User Data Table</h3>
        <TableContainer component={Paper} className="table-container">
          <Table size="small">
            {/* TODO: add rows */}
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
}
