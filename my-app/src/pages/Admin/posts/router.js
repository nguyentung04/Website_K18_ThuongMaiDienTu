import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import CategoryTable from "./component/posts";
import Editposts from "./component/edit"
import Addposts from "./component/add"

const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CategoryTable />} />
        <Route path="/add" element={<Addposts />} />
        <Route path="/edit/:id" element={<Editposts />} />
      </Route>
      <Route path="*" element={<Navigate to="/posts" />} />
    </Routes>
  );
};

export default OrdersRoutes;
