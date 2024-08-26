import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./menu.module.css"; // Ensure you're importing the CSS correctly

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* Toggle button for mobile view */}
      <button
        className={`${styles.sidebarToggle} ${isOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <ul>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/product/addProduct">Add Product</Link>
          </li>
          <li>
            <Link to="/product/">List Product</Link>
          </li>
          <li>
            <Link to="/admin/profile">Profile</Link>
          </li>
          <li>
            <Link to="/admin/updatePassword">Update Password</Link>
          </li>
          <li>
            <Link to="/#" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar} />}
    </>
  );
};

export default Menu;
