import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ navData }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link className='navbar-title' to="/">Biboy Lending Sheessh</Link>
      </div>
      <ul className="navbar-menu">
        {navData.map((item, index) => (
          <li
            key={index}
            className="navbar-item"
            onMouseEnter={() => item.submenu && handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {item.path ? (
              <Link to={item.path} className="navbar-link">
                {item.name}
              </Link>
            ) : (
              item.name
            )}
            {item.submenu && activeDropdown === index && (
              <ul className="dropdown">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex} className="dropdown-item">
                    <Link to={subItem.path} className="dropdown-link">
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
