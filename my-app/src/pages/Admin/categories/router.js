import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import CategoryTable from "./component/category";
import Editcategories from "./component/edit"
import Addcategories from "./component/add"

const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CategoryTable />} />
        <Route path="admin/categories/add" element={<Addcategories />} />
        <Route path="admin/Category/edit/:id" element={<Editcategories />} />
      </Route>
      <Route path="*" element={<Navigate to="/Category" />} />
    </Routes>
  );
};

export default OrdersRoutes;
