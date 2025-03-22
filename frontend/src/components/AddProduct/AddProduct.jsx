import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getAllCategories } from "../../services/api";
import styles from "./AddProduct.module.css";
import { AuthContext } from "../../context/AuthContext";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    stock: "",
    unitPrice: "",
    totalPrice: 0,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories(user.token);
        setCategories(response.data.categories || response.data); // Adjust based on API response
      } catch (err) {
        setError("Failed to fetch categories. Please try again later.");
      }
    };
    fetchCategories();
  }, [user.token]);

  // Calculate total price dynamically
  useEffect(() => {
    const calculatedTotalPrice = Number(product.stock) * Number(product.unitPrice);
    setProduct((prev) => ({
      ...prev,
      totalPrice: calculatedTotalPrice,
    }));
  }, [product.stock, product.unitPrice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "stock" || name === "unitPrice") {
      if (value < 0) return; // Prevent negative values
    }

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!product.name || !product.category || !product.stock || !product.unitPrice || !product.totalPrice) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const productData = {
        name: product.name,
        category: product.category,
        quantity: Number(product.stock), // Rename stock to quantity
        unitPrice: Number(product.unitPrice),
        totalPrice: Number(product.totalPrice),
      };

      console.log("Submitting product:", productData); // Debugging: Check the data being sent
      await createProduct(productData, user.token);
      alert("Product added successfully!");
      navigate("/"); // Adjust redirection if needed
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to add product. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Add New Product</h1>
        {error && <div className={styles.error}>{error}</div>}
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
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
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
            <label htmlFor="unitPrice">Unit Price</label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={product.unitPrice}
              onChange={handleInputChange}
              placeholder="Enter unit price"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Total Price (calculated automatically) */}
          <div className={styles.formGroup}>
            <label htmlFor="totalPrice">Total Price</label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={product.totalPrice}
              readOnly
              placeholder="Total price will be calculated automatically"
            />
          </div>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.backButton} 
              onClick={handleBack}
            >
              Back
            </button>
            <button 
              type="submit" 
              className={styles.nextButton}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;