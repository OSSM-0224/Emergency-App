import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import "leaflet/dist/leaflet.css";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import Users from "./pages/Users";
import Emergency from "./pages/Emergency";
import EmergencyInfo from "./pages/EmergencyInfo";
import Reports from "./pages/Reports";
import Notification from "./pages/Notification";
import Logout from "./pages/Logout";

import "./App.css";
import Sidebar from "./components/Sidebar";
import { rtdb } from "./firebase";

function App() {
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  useEffect(() => {
    const emergencyRef = ref(rtdb, "Emergencies/");
    onValue(emergencyRef, (snapshot) => {
      const data = snapshot.val();
      const hasActive = data && Object.values(data).some(e => !e.resolved);
      setEmergencyAlert(hasActive);
    });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar emergencyAlert={emergencyAlert} />
        <div className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/emergencyinfo" element={<EmergencyInfo />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  );
}

export default App;
