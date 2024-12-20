import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import ProductsTable from "./component/Products";
import AddProducts from "./component/AddProduct";
import EditProducts from "./component/EditProduct";
import ProductDetail from "./component/ProductDetail";
const ProductsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductsTable />} />
        <Route path="admin/products/add" element={<AddProducts />} />
        <Route path="admin/products/edit/:id" element={<EditProducts />} />
        <Route path="admin/products/detail/:id" element={<ProductDetail />} />

      </Route>
      <Route path="/*" element={<Navigate to="/products" />} />
    </Routes>
  );
};

export default ProductsRoutes;
