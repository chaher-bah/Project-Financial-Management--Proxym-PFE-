import React from "react";
import { Outlet ,useLocation,useNavigate} from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useGetUserData } from "../hooks/useGetUserData";
import { checkUserAccess } from "../utils/roles";
const Navbar = React.lazy(() => import("../Components/Navbar/Navbar"));
const MainLayout = () => {
  const { userData,loading } = useGetUserData();
  const location = useLocation();
  const navigate = useNavigate();
  const path =location.pathname;
  const userRoles = userData?.role||[];
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
