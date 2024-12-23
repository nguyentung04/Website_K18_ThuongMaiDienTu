import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Client/Navbar/Navbar";
import Footer from "../components/Client/Footer/Footer";
import CartProvider from "../components/Client/componentss/Cart_Context";

const ClientLayout = () => {
  const location = useLocation();

  // // Danh sách các trang mà Footer sẽ không hiển thị
  // const noFooterRoutes = ["/signin", "/signup"];

  // const shouldHideFooter =
  //   noFooterRoutes.includes(location.pathname) ||
  //   /^\/orders\/\d+$/.test(location.pathname);

  return (
    <>
      {" "}
      <CartProvider>
        <Navbar />
      </CartProvider>
      <main className="mt-3">
        <Outlet /> {/* Outlet sẽ hiển thị các trang con */}
      </main>
      {<Footer />}
    </>
  );
};

export default ClientLayout;