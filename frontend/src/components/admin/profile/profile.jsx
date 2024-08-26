import React from "react";
import styles from "./profile.module.css";
import Menu from "../menu/menu";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const adminInfo = {
    name: "John Doe",
    email: "johndoe@example.com",
    role: "Administrator",
  };
  const navigate = useNavigate();
  if (!localStorage.getItem("token")) {
    navigate("/login");
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.profileContainer}>
      <Menu />
      <h1 className={styles.profileTitle}>Profile</h1>
      <div className={styles.profileCard}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="56"
          fill="currentColor"
          className={styles.profileIcon} // Updated to className
          viewBox="0 0 16 16"
          aria-labelledby="person-icon" // Accessibility enhancement
          role="img"
        >
          <title id="person-icon">Admin Profile Icon</title>
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
        <h2 className={styles.profileName}>{adminInfo.name}</h2>
        <p className={styles.profileEmail}>{adminInfo.email}</p>
        <p className={styles.profileRole}>{adminInfo.role}</p>
        <div className={styles.buttonContainer}>
          <button onClick={handleLogout} className={styles.button}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
