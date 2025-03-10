import React from 'react'
import './card.css'
import PropTypes from 'prop-types';
const Card = ({ icon, name }) => {
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-icon">
        {icon}
      </div>
      <div className="sidebar-card-name">
        {name}
      </div>
    </div>
  )
}

Card.propTypes = {
  icon: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired
}

export default Card