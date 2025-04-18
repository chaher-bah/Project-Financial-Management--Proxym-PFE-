import React, { useState } from "react";
import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useKeycloak } from "@react-keycloak/web";
const Navbar = () => {
  const { keycloak } = useKeycloak();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {userData}=useGetUserData();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="navbarContainer">
      <div className="navbarUser" onClick={toggleDropdown}>
        <span>Hi, {userData.name}</span>
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
                src={userData.photo}
                sx={{ width: 70, height: 70, mr: 3 }}
              /><div>
              <div className="profileName">{userData.name}</div>
              <div className="profileRole" style={{fontWeight:"lighter",fontStyle:"italic"}}>{userData.role}</div></div>
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
              <Button 
                variant="contained"
                color="error"
                size="medium"
                onClick={() => {keycloak.logout();
                }}
                >Se Déconnecter</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
