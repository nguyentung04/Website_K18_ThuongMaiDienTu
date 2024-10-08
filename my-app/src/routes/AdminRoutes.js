import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Dashboard from "../pages/Admin/Dashboard";
import ProductsRoutes from "../pages/Admin/products/router";
import UserRoutes from "../pages/Admin/user/router";


import ProductdetailRoutes from "../pages/Admin/productdetail/router";
import DistrictsRoutes from "../pages/Admin/districts/router";
import CitiesRoutes from "../pages/Admin/cities/router";
import OrdersRoutes from "../pages/Admin/orders/router";
import CategoryRoutes from "../pages/Admin/categories/router";
import CommentsRoutes from "../pages/Admin/comments/router";

const AdminRoutes = () => {
  // Lấy thông tin từ localStorage
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Nếu không có token hoặc vai trò không phải admin, chuyển đến trang đăng nhập
  if (!token || role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="category/*" element={<CategoryRoutes />} />
      <Route path="products/*" element={<ProductsRoutes />} />
      <Route path="user/*" element={<UserRoutes />} />
      <Route path="productdetail/*" element={<ProductdetailRoutes />} />
      
      <Route path="districts/*" element={<DistrictsRoutes />} />
      <Route path="cities/*" element={<CitiesRoutes />} />
      <Route path="orders/*" element={<OrdersRoutes />} />
      <Route path="comments/*" element={<CommentsRoutes />} />
      <Route path="/" element={<Navigate to="dashboard" />} /> {/* Điều hướng về dashboard */}
    </Routes>
  );
};

export default AdminRoutes;
