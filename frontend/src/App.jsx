import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import ProductTable from "./components/ProductTable/ProductTable";
import ProductDetailPage from "./components/ProductDetail/ProductDetailPage";
import AddProduct from "./components/AddProduct/AddProduct";
import UpdatePage from "./components/UpdatePage/UpdatePage";
import SignUp from "./pages/signup/SignUp";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Categories from "./pages/categories/Categories";
import CategoryProducts from "./pages/categories/categoryProduct/CategoryProduct";
// New component for products in a category

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to={"/"} />} />
          <Route path="/products" element={<ProductTable />} />
          <Route path="/category" element={<Categories />} /> {/* Categories Page */}
          <Route path="/categories/:categoryName/products" element={<CategoryProducts />} /> {/* Products by Category */}
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product/:id" element={<UpdatePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
