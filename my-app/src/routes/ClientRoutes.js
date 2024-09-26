import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Client/Home/Home";
import Products from "../pages/Client/Products/Products";
import Women from "../pages/Client/ProductsWomen/Products";
import Men from "../pages/Client/ProductsMen/Products";
import OldProductsPremium from "../pages/Client/OldProductsPremium/Products";
import About from "../pages/Client/About/About";
import SignIn from "../pages/Auth/Login/SignIn";
import SignUp from "../pages/Auth/Register/SignUp";
import Profile from "../pages/Client/Profile/ClientProfile";
import ProductDetails from "../pages/Client/ProductDetails/ProductDetails";
import Cart from "../pages/Client/Cart/Cart";
import CheckoutForm from "../pages/Client/CheckoutForm/CheckoutForm";
import OrderHistory from "../pages/Client/OrderHistory/OrderHistory";
import OrderDetail from "../pages/Client/OrderDetail/OrderDetail";
import ClientLayout from "../layout/Clientlayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/women" element={<Women />} />
        <Route path="/men" element={<Men />} />
        <Route path="/premium" element={<OldProductsPremium />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/formcheckout" element={<CheckoutForm />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Route>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default ClientRoutes;
