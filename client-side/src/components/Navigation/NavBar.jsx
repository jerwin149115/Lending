import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ navData, hasUnreadNotifications }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMouseEnter = (menuIndex) => {
    setActiveDropdown(menuIndex);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? '❮' : '❯'}
      </button>

      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <h2 className="sidebar-title">
              <span className="sidebar-logo">🏢</span>
              3 Brothers Company
            </h2>
          )}
        </div>

        <ul className="sidebar-menu">
          {navData.map((item, index) => (
            <li
              key={index}
              className="sidebar-item"
              onMouseEnter={() => item.submenu && handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {item.path ? (
                <Link to={item.path} className="sidebar-link notification-link">
                  {item.name}

                  {/* 🔴 RED DOT with pulse animation */}
                  {item.name === 'Notifications' && hasUnreadNotifications && (
                    <span className="notification-dot" />
                  )}
                </Link>
              ) : (
                <span className="sidebar-link">{item.name}</span>
              )}

              {item.submenu && (
                <ul
                  className={`sidebar-dropdown ${
                    activeDropdown === index ? 'show' : ''
                  }`}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex} className="dropdown-item">
                      <Link to={subItem.path} className="dropdown-link">
                        <span className="submenu-icon">📄</span>
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* User Profile Section */}
        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <div className="user-name">Admin User</div>
                <div className="user-email">admin@3brothers.com</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;