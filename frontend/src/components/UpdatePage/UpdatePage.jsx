import React, { useState, useEffect } from "react";
import styles from "./UpdatePage.module.css";
import { useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UpdatePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    stock: 0,
    unitPrice: 0,
    totalPrice: 0,
  });

  // Pre-fill the form with the existing product data
  useEffect(() => {
    const productId = window.location.pathname.split("/")[2];
    const fetchProductDetails = async () => {
      try {
        const response = await getProductById(productId, user.token);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        alert("Failed to fetch product details. Please try again.");
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [user.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const newProduct = {...product, [name]: value};
    
    // Calculate total price when unit price or stock changes
    if (name === 'unitPrice' || name === 'stock') {
      newProduct.totalPrice = Number(newProduct.stock) * Number(newProduct.unitPrice);
    }
    
    setProduct(newProduct);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productId = window.location.pathname.split("/")[2];

    try {
      const updatedProduct = await updateProduct(productId, {
        name: product.name,
        category: product.category,
        stock: Number(product.stock),
        unitPrice: Number(product.unitPrice),
        totalPrice: Number(product.totalPrice)
      }, user.token);

      console.log("Product Updated:", updatedProduct.data);
      alert("Product updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      alert("Failed to update the product. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Update Product</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Product Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              placeholder="Enter product category"
              required
            />
          </div>

          {/* Stock */}
          <div className={styles.formGroup}>
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleInputChange}
              placeholder="Enter stock quantity"
              min="0"
              required
            />
          </div>

          {/* Unit Price */}
          <div className={styles.formGroup}>
            <label htmlFor="unitPrice">Unit Price ($)</label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={product.unitPrice}
              onChange={handleInputChange}
              placeholder="Enter unit price"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          {/* Total Price (Read-only) */}
          <div className={styles.formGroup}>
            <label htmlFor="totalPrice">Total Price ($)</label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={product.totalPrice}
              readOnly
              disabled
            />
          </div>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.backButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className={styles.nextButton}>
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePage;