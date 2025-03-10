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
    <aside>
      <div className="sidebar">
        <div className="sidebar-header">
          <img src="/src/assets/company-logo.svg" alt="logo" />
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <div key={item.name} onClick={() => setActiveItem(item.name)}>
              <Card
                icon={item.icon}
                name={item.name}
                className={activeItem === item.name ? "active" : ""}
              />
            </div>
          ))}
        </div>
      </div>{" "}
    </aside>
  );
};

export default Sidebar;
