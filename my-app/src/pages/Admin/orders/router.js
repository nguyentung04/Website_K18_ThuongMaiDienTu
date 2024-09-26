import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import OrdersTable from "./component/order";
import OrdersDetail from "./component/orders_detail";

const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OrdersTable />} />
        <Route path="/admin/orders/:orderId" element={<OrdersDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default OrdersRoutes;
