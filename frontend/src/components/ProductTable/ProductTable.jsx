import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductTable.module.css";
import { AuthContext } from "../../context/AuthContext";
import { deleteProduct, getProducts } from "../../services/api";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(user.token);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError("Invalid data format received from server");
        }
      } catch (error) {
        setError("Failed to fetch products: " + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user.token]);

  const handleUpdateClick = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  const handleDetailsClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleDeleteClick = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId, user.token);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error.response?.data?.error || error.message);
      alert("Failed to delete product.");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF'
    }).format(number);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Product List</h2>
      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Unit Price</th>
            <th>Total Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td 
                className={styles.productName}
                onClick={() => handleDetailsClick(product._id)}
              >
                {product.name}
              </td>
              <td>{product.category}</td>
              <td className={styles.numeric}>{product.stock}</td>
              <td className={styles.numeric}>
                {formatCurrency(product.unitPrice)}
              </td>
              <td className={styles.numeric}>
                {formatCurrency(product.totalPrice)}
              </td>
              <td className={styles.actions}>
                <button
                  className={styles.updateButton}
                  onClick={() => handleUpdateClick(product._id)}
                >
                  Update
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className={styles.totalLabel}>
              Total Inventory Value:
            </td>
            <td className={styles.totalValue}>
              {formatCurrency(
                products.reduce((sum, product) => sum + product.totalPrice, 0)
              )}
            </td>
          <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;