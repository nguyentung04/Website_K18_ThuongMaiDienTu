import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
// import OrdersTable from "./component/order";
import PaidTable from "./component/paid";
import UnpaidTable from "./component/unpaid";
import OrdersDetail from "./component/orders_detail";
import OrderDelivered from "./component/Order_Delivered";
import CancelledOrder from "./component/order_cancelled";

const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<OrdersTable />} /> */}
        <Route path="paid" element={<PaidTable />} />
        <Route path="unpaid" element={<UnpaidTable />} />
        <Route path="Order Delivered" element={<OrderDelivered />} />
        <Route path="order cancelled" element={<CancelledOrder />} />
        <Route path="paid/order_items/:id" element={<OrdersDetail />} />
        <Route path="unpaid/order_items/:id" element={<OrdersDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default OrdersRoutes;
