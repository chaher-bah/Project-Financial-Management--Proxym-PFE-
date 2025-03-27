import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
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
} from "react-icons/fi";
import { Drawer, List, Toolbar, Typography, IconButton } from "@mui/material";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/" },
    { name: "Budget", icon: <FiDollarSign />, path: "/budget" },
    { name: "Reports", icon: <FiPieChart />, path: "/reports" },
    { name: "Team", icon: <FiUsers />, path: "/team" },
    { name: "Role Assignment", icon: <FiUserX />, path: "/role-assignment" },
    {
      name: "Account Management",
      icon: <FiTool />,
      path: "/account-management",
    },
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
