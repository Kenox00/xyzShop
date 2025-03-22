import React, { useContext } from "react";
import styles from "./Dashboard.module.css";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaThLarge, FaUser } from "react-icons/fa";
import ProductTable from "../ProductTable/ProductTable";
import {  useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogOut";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { logout } = useLogout();

  const handleAddProduct = () => {
    navigate("/add-product");
  };
  const handleCategories = () => {
    navigate("/category");
  }
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.dashboardContainer}>
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.logo}>
        <FaBoxOpen className={styles.iconLarge} />
        <h1 className={styles.title}>Warehouse Inventory System</h1>
        </div>
        <div className={styles.userInfo}>
          <p>{user.email}</p>
          <button
            className={styles.logoutButton}
            onClick={handleLogout} 
              >

            Logout
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <div className={styles.card} onClick={handleAddProduct}>
          <FaBoxOpen className={styles.icon} />
          <p>Add Product</p>
        </div>
        <div className={styles.card} onClick={handleCategories}>
          <FaThLarge className={styles.icon} />
          <p>Categories</p>
        </div>
      </div>
    </div>
    <ProductTable/>
    </div>
  );
};

export default Dashboard;
