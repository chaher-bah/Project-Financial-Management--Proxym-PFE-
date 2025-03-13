import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Reports from "./Pages/Reports";
import { Box } from "@mui/material";

function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "60px" }}>
          <Navbar />
          <Routes>
            <Route path="/reports" element={<Reports />} />
            {/* Add other routes here */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
