import React,{Suspense,lazy} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";

const Reports= lazy(()=> import( "./Pages/Report/Reports"));
const ApprovedReports =lazy(()=>import( "./Pages/Report/ApprovedReports"));
const NotApprovedReports =lazy(()=> import( "./Pages/Report/NotApprovedReports"));
const Parameters =lazy(()=> import( "./Pages/Settings/Parameters"));
import { Box } from "@mui/material";
import Page404 from "./Pages/Page404/Page404";

function App() {
  return (
    <Router>
      <Suspense fallback={<Page404 />}>
      <Routes>
        <Route path="/error" element={<Page404 />} />
        <Route path="*" element={
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
                <Route path="/" element={<Navbar />} />
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
        } />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
