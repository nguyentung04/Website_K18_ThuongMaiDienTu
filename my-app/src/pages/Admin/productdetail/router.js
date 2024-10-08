import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import ProductsTable from "./component/Product_detail";
import AddProducts from "./component/AddProduct";
import EditProducts from "./component/EditProduct";

const ProductsDetailRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductsTable />} />
        <Route path="admin/productsdetail/add" element={<AddProducts />} />
        <Route path="admin/productsdetail/edit/:id" element={<EditProducts />} />
        
      </Route>
      <Route path="/*" element={<Navigate to="/productdetail" />} />
    </Routes>
  );
};

export default ProductsDetailRoutes;
