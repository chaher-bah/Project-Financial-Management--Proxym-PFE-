import React, { useState } from "react";
import Card from "../Card/Card";
import "./sidebar.css";
import {
  FiHome,
  FiDollarSign,
  FiBarChart2,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { Drawer, List, Toolbar, Typography } from "@mui/material";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FiHome /> },
    { name: "Budget", icon: <FiDollarSign /> },
    { name: "Reports", icon: <FiBarChart2 /> },
    { name: "Team", icon: <FiSettings /> },
    { name: "Role Assignment", icon: <FiUsers /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: '19rem',
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
          style={{ width: "100%",marginBottom: "3rem" }}
        />
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <Card
            key={item.name}
            icon={item.icon}
            name={item.name}
            className={activeItem === item.name ? "active" : ""}
            onClick={() => setActiveItem(item.name)}
          />
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
