import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard";
import ProductsRoutes from "../pages/Admin/products/router";
import UserRoutes from "../pages/Admin/user/router";

import ProductdetailRoutes from "../pages/Admin/productdetail/router";
import OrdersRoutes from "../pages/Admin/orders/router";
import CategoryRoutes from "../pages/Admin/categories/router";
import CommentsRoutes from "../pages/Admin/comments/router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PostsRoutes from "../pages/Admin/posts/router";
import Post_categoriesRoutes from "../pages/Admin/post_categories/router";
import AdminLayout from "../layout/Adminlayout";

const AdminRoutes = () => {
  // Lấy thông tin từ localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Nếu không có token hoặc vai trò không phải admin, chuyển đến trang đăng nhập
  if (!token || role !== "admin") {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
      
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="category/*" element={<CategoryRoutes />} />
        <Route path="products/*" element={<ProductsRoutes />} />
        <Route path="user/*" element={<UserRoutes />} />
        <Route path="productdetail/*" element={<ProductdetailRoutes />} />
        <Route path="posts/*" element={<PostsRoutes />} />
        <Route path="post_categories/*" element={<Post_categoriesRoutes />} />
        <Route path="orders/*" element={<OrdersRoutes />} />
        <Route path="comments/*" element={<CommentsRoutes />} />
        <Route path="/" element={<Navigate to="dashboard" />} />{" "}
        {/* Điều hướng về dashboard */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;