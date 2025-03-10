import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import "./card.css";

const Card = ({ icon, name, className, onClick }) => {
  return (
    <ListItem button className={`sidebar-card ${className}`} onClick={onClick}>
      <ListItemIcon className="sidebar-card-icon">{icon}</ListItemIcon>
      <ListItemText primary={name} className="sidebar-card-name" />
    </ListItem>
  );
};

Card.propTypes = {
  icon: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
