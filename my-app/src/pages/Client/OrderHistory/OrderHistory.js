import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./OrderHistory.css";
import { Divider } from "@chakra-ui/react";

const BASE_URL = "http://localhost:3000"; // Đảm bảo BASE_URL đúng với cấu hình API của bạn

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    const fetchOrders = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      if (username && token) {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/ordersByName/${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setOrders(response.data);
        } catch (err) {
          console.error("Lỗi khi lấy đơn hàng:", err);
          setError("Có lỗi xảy ra khi lấy dữ liệu đơn hàng.");
        } finally {
          setLoading(false); // Đặt trạng thái loading thành false khi dữ liệu đã được lấy
        }
      } else {
        setError("Chưa đăng nhập.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="order-history">
      <h1>Lịch sử Đơn hàng</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="orders-container">
        {orders.length > 0
          ? orders.map((order) => (
              <div className="order-card">
                <div className="order-header">
                  <strong>Đơn hàng: #{order.order_id}</strong>
                  <span className="order-status">Đã nhận hàng</span>
                </div>
                <Divider />
                <div className="order-body">
                  <img
                    src={`${BASE_URL}/uploads/products/${order.image}`}
                    alt={order.name}
                    className="product-image"
                  />

                  <div className="order-info">
                    <span>{order.name}</span>
                    <span>Tổng tiền: <span className="span-price"> {formatCurrency(order.total)}</span></span>
                  </div>
                </div>{" "}
                <div className="order-actions">
                  <Link
                    to={`/orders/${order.order_id}`}
                    className="detail-button"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          : !error && <p>Không có đơn hàng nào.</p>}
      </div>
    </div>
  );
};

export default OrderHistory;
