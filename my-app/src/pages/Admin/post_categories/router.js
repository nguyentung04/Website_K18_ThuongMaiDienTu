/* eslint-disable react/jsx-pascal-case */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import CategoryTable from "./component/post_categories";
import Editpost_categories from "./component/edit"
import Addpost_categories from "./component/add"

const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CategoryTable />} />
        <Route path="/add" element={<Addpost_categories />} />
        <Route path="/edit/:id" element={<Editpost_categories />} />
      </Route>
      <Route path="*" element={<Navigate to="/post_categories" />} />
    </Routes>
  );
};

export default OrdersRoutes;
