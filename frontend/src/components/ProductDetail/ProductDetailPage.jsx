import React, { useState, useEffect, useContext } from "react";
import { getProductById, productIn, productOut } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import styles from "./ProductDetailPage.module.css";
import { useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionLoading, setTransactionLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productId = window.location.pathname.split("/")[2];
      const response = await getProductById(productId, user.token);
      setProduct(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch product: ' + (error.response?.data?.error || error.message));
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (type, quantity, unitPrice) => {
    if (!user?.token) {
      setError('User is not authenticated.');
      return;
    }

    setTransactionLoading(true);
    setError('');

    try {
      const productId = product._id;
      const totalPrice = quantity * unitPrice;
      const data = { quantity, unitPrice, totalPrice };

      if (type === "out" && quantity > product.stock) {
        setError('Insufficient stock!');
        setTransactionLoading(false);
        return;
      }

      const apiFunction = type === "in" ? productIn : productOut;
      const response = await apiFunction(productId, data, user.token);
      
      // Update the product state with the new data
      if (response.data.product) {
        setProduct(response.data.product);
      } else {
        // Fetch fresh product data if the response doesn't include updated product
        await fetchProduct();
      }

      // Show success message
      alert(`Transaction processed successfully: ${type.toUpperCase()}`);
      navigate('/');
    } catch (error) {
      setError(`Failed to process ${type} transaction: ${error.response?.data?.error || error.message}`);
      console.error(`Failed to process ${type} transaction:`, error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = parseInt(e.target.quantity.value, 10);
    const unitPrice = parseFloat(e.target.unitPrice.value);
    const type = e.target.transactionType.value;

    if (isNaN(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity!');
      return;
    }

    if (isNaN(unitPrice) || unitPrice <= 0) {
      setError('Please enter a valid unit price!');
      return;
    }

    handleTransaction(type, quantity, unitPrice);
    e.target.reset();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading product details...</div>
      </div>
    );
  }

  if (error && !product._id) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Product Details Section */}
      <div className={styles.productDetails}>
        <h1 className={styles.productTitle}>{product.name}</h1>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Category:</span>
            <span className={styles.value}>{product.category}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Current Stock:</span>
            <span className={styles.value}>{product.stock}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Current Unit Price:</span>
            <span className={styles.value}>${product.unitPrice?.toFixed(2)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Total Value:</span>
            <span className={styles.value}>${product.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Transaction Form Section */}
      <div className={styles.transactionSection}>
        <h2 className={styles.sectionTitle}>New Transaction</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.transactionForm}>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity:</label>
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              min="1" 
              required 
              className={styles.input}
              disabled={transactionLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="unitPrice">Unit Price ($):</label>
            <input 
              type="number" 
              id="unitPrice" 
              name="unitPrice" 
              min="0.01" 
              step="0.01"
              defaultValue={product.unitPrice}
              required 
              className={styles.input}
              disabled={transactionLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Transaction Type:</label>
            <div className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="transactionIn"
                  name="transactionType"
                  value="in"
                  defaultChecked
                  disabled={transactionLoading}
                />
                <label htmlFor="transactionIn">Product In</label>
              </div>
              <div className={styles.radioOption}>
                <input 
                  type="radio" 
                  id="transactionOut" 
                  name="transactionType" 
                  value="out"
                  disabled={transactionLoading}
                />
                <label htmlFor="transactionOut">Product Out</label>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={transactionLoading}
          >
            {transactionLoading ? 'Processing...' : 'Process Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailPage;