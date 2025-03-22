import React, { useEffect, useState } from 'react';
import styles from './Categories.module.css';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/category', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
      }
    };

    fetchCategories();
  }, [user.token]);

  const handleAddCategory = async (categoryName) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/category',
        { name: categoryName }, // Use the correct key
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (error) {
      console.error('Error creating category:', error.response?.data || error.message);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/categories/${categoryName}/products`);
  };

  return (
    <div className={styles.container}>
      {categories.map((category) => (
        <div
          key={category._id}
          className={styles.card}
          onClick={() => handleCategoryClick(category.name)}
        >
          <h2>{category.name}</h2>
          <p>{category.description || 'No description available.'}</p>
        </div>
      ))}
      <div
        className={styles.card}
        onClick={() => {
          const categoryName = prompt('Enter the name of the new category:');
          if (categoryName) {
            handleAddCategory(categoryName);
          }
        }}
      >
        <h2>Add category</h2>
        <p>Click here to add a new category</p>
      </div>
    </div>
  );
};

export default Categories;
