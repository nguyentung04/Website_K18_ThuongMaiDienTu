import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Client/Navbar/Navbar";
import Footer from "../components/Client/Footer/Footer";

const ClientLayout = () => {
  const location = useLocation();

  // Danh sách các trang mà Footer sẽ không hiển thị
  const noFooterRoutes = ["/signin", "/signup", "/cart", "/orderhistory"];

  // Kiểm tra nếu trang hiện tại là một trong các noFooterRoutes hoặc là /orders/:id
  const shouldHideFooter =
    noFooterRoutes.includes(location.pathname) ||
    /^\/orders\/\d+$/.test(location.pathname);

  return (
    <>
      <Navbar />
      <main >
        <Outlet /> {/* Outlet sẽ hiển thị các trang con */}
      </main>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default ClientLayout;
