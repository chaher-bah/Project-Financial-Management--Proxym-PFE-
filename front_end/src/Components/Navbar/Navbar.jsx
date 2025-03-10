import React from "react";
import "./Navbar.css";
import {FiUser } from "react-icons/fi";
const Navbar = () => {
  return (
    <div className="navbarContainer">
      <div className="navbarUser">
        {/* TO DO link depending on the keycloak data  */}
        <span>Hi, USER NAME</span>
        <div className="navbarUserIcon">
          <FiUser />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
