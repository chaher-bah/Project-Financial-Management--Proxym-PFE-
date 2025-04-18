import React, { useState } from "react";
import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbarContainer">
      <div className="navbarUser" onClick={toggleDropdown}>
        <span>Hi, Chaher</span>
        <div className="navbarUserIcon">
          <Avatar className="navbarAvatarIcon" src="/myAvatar.png" />
        </div>
      </div>
      {isDropdownOpen && (
        <div className="navbarDropdown">
          <div className="profileCard">
            <div className="profileHeader">
              <Avatar
                className="profileAvatarIcon"
                src="/myAvatar.png"
                sx={{ width: 70, height: 70, mr: 3 }}
              />
              <div className="profileName">Chaher BAHRI</div>
            </div>
            <div className="profileOptions">
              <div
                className="profileOption"
                onClick={() => (window.location.href = "/account-management")}
                style={{ cursor: "pointer" }}
              >
                <span>My Profile</span>
                <small>Account settings and more</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
