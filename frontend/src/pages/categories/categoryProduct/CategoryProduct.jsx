import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './CategoryProduct.module.css';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/category/${categoryName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );  
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className={styles.container}>
      <h1>Products in {categoryName}</h1>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product._id} className={styles.card}>
            <h2>{product.name}</h2>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
