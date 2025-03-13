import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../Card/Card";85
import "./sidebar.css";
import {
  FiHome,
  FiDollarSign,
  FiUsers,
  FiTool,
  FiPieChart,
  FiUserX,
} from "react-icons/fi";
import { Drawer, List, Toolbar, Typography } from "@mui/material";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");

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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: "19rem",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "19rem",
          boxSizing: "border-box",
          backgroundColor: "var(--primary-color)",
          color: "white",
          padding: "2rem 1rem ",
        },
      }}
    >
      <Toolbar>
        <img
          src="/src/assets/company-logo.svg"
          alt="logo"
          style={{ width: "100%", marginBottom: "3rem" }}
        />
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              icon={item.icon}
              name={item.name}
              className={activeItem === item.name ? "active" : ""}
              onClick={() => setActiveItem(item.name)}
            />
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
