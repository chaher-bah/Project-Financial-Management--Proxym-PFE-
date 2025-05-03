import React from "react";
import { Outlet ,useLocation,useNavigate} from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import { useGetUserData } from "../hooks/useGetUserData";
import { useRole } from "../hooks/useRole";
import { checkUserAccess } from "../utils/roles";
const MainLayout = () => {
  const { userData,loading } = useGetUserData();
  const location = useLocation();
  const navigate = useNavigate();
  const path =location.pathname;
  const userRoles = userData?.role||[];
  console.log("userRoles",userData);
  const hasNoAccess = !checkUserAccess(userRoles) && path!=='/error';
  if (hasNoAccess) {
    navigate('/error', { replace: true });
    return null;
  }
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
