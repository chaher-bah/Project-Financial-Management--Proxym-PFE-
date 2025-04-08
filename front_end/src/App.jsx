import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Reports from "./Pages/Report/Reports";
import ApprovedReports from "./Pages/Report/ApprovedReports";
import NotApprovedReports from "./Pages/Report/NotApprovedReports";
import Parameters from "./Pages/Settings/Parameters";
import { Box } from "@mui/material";

function App() {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
        }}
      >
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "60px",
            width: `calc(100% - var(--sidebar-width))`,
            overflowX: "hidden",
          }}
        >
          <Navbar />
          <Routes>
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/approved" element={<ApprovedReports />} />
            <Route
              path="/reports/notapproved"
              element={<NotApprovedReports />}
            />
            <Route path="/account-management" element={<Parameters />} />
            {/* Add other routes here */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
