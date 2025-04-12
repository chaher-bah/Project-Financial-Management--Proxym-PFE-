import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";

const MainLayout = () => {
  return (
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          p: 3,
          mt: "60px",
          width: `calc(100% - var(--sidebar-width))`,
          overflowX: "hidden",
        }}
      >
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
