import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
// import Card from "../Card/Card";
import "./sidebar.css";
import {
  FiHome,
  FiDollarSign,
  FiUsers,
  FiTool,
  FiPieChart,
  FiUserX,
  FiChevronLeft,
  FiChevronRight,
  FiTable,
  FiLink 
  
} from "react-icons/fi";
import { Drawer, List, Toolbar, IconButton } from "@mui/material";
import {useGetUserData} from "../../hooks/useGetUserData";
const Card =React.lazy(() => import("../Card/Card"));

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isExpanded, setIsExpanded] = useState(true);
  const { userData } = useGetUserData();
  

  const baseMenuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dash" },
    { name: "Budget", icon: <FiDollarSign />, path: "/budget" },
    { name: "Validation des Docs", icon: <FiPieChart />, path: "/reports" },
    { name: "Gestion des Projets", icon: <FiTable   />, path: "/gestion-projets" },
    { name: "Equipes", icon: <FiLink  />, path: "/team" },
    { name:"Gestion du Personnel", icon: <FiUsers />, path: "/gestion-personnel" },
    {
      name: "Parametres",
      icon: <FiTool />,
      path: "/account-management",
    },
  ];
  const adminMenuItems = [
    { name: "Roles config", icon: <FiUserX />, path: "/role-assignment" },
  ];
  const menuItems = [
    ...baseMenuItems,
    ...(userData.role.includes("Admin") ? adminMenuItems : [])
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded
          ? "var(--sidebar-width)"
          : "var(--mini-sidebar-width)",
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isExpanded
            ? "var(--sidebar-width)"
            : "var(--mini-sidebar-width)",
          boxSizing: "border-box",
          backgroundColor: "var(--primary-color)",
          color: "white",
          padding: "2rem 1rem ",
          overflowX: "hidden",
          alignItems: "center",
          gap: "10px",
          transition: "width 0.3s ease",
        },
      }}
    >
      <Toolbar
        style={{ marginBottom: "2.5rem", alignItems: "center", gap: "10px" }}
      >
        {isExpanded && (
          <img
            src="/src/assets/company-logo.svg"
            alt="logo"
            style={{ width: "88%" }}
          />
        )}
        <IconButton
          onClick={toggleSidebar}
          style={{ color: "white", border: "2px solid white" }}
        >
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </IconButton>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {isExpanded ? (
              <Card
                icon={item.icon}
                name={isExpanded ? item.name : ""}
                className={activeItem === item.name ? "active" : ""}
                onClick={() => setActiveItem(item.name)}
              />
            ) : (
              <Card
                icon={item.icon}
                className={activeItem === item.name ? "active" : ""}
                onClick={() => setActiveItem(item.name)}
              />
            )}
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
