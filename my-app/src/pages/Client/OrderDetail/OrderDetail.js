import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import "./OrderDetail.css";
import { AddressIcon, CardIcon } from "../../../components/icon/icon";

const BASE_URL = "http://localhost:3000";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/orderDetail/${id}`, {
          timeout: 10000,
        });
        console.log("API Response:", response);
        setOrder(response.data); // Cập nhật state order với mảng dữ liệu từ API
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Có lỗi xảy ra khi lấy dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async (orderId) => {
    const username = localStorage.getItem("username");

    if (username) {
      // Hiện hộp thoại xác nhận
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn hủy đơn hàng này không?"
      );

      if (isConfirmed) {
        try {
          // Gửi yêu cầu hủy đơn hàng
          const response = await axios.delete(
            `${BASE_URL}/api/orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              data: { username }, // Nếu cần gửi tên người dùng để xác thực
            }
          );

          if (response.status === 200) {
            // Hiển thị thông báo hủy thành công
            alert("Hủy đơn hàng thành công!");

            // Cập nhật danh sách đơn hàng
            setOrder((prevOrders) =>
              prevOrders.filter((item) => item.order_id !== orderId)
            );

            // Chuyển hướng về trang đơn hàng
            navigate("/orderhistory");
          } else {
            setError("Có lỗi xảy ra khi hủy đơn hàng.");
          }
        } catch (err) {
          console.error("Lỗi khi hủy đơn hàng:", err);
          setError("Có lỗi xảy ra khi hủy đơn hàng.");
        }
      }
    } else {
      setError("Thiếu thông tin tên người dùng.");
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Kiểm tra xem có dữ liệu đơn hàng hay không
  if (!order.length) {
    return <p>Không có đơn hàng nào.</p>;
  }

  return (
    <div className="order-detail-container">
      <h3>Chi tiết đơn hàng #{order[0].order_id}</h3>
      <div className="order-info">
        <div className="info-section">
          <span>
            <AddressIcon />
            THÔNG TIN NHẬN HÀNG
          </span>
          {/* <div>
            <div className="info-section-name">Người nhận:</div> {order[0].name} - {order[0].phone}
          </div> */}
          <div>
            <div className="info-section-address">Địa chỉ nhận:</div>
            <div className="info-section-address-content">
              {order[0].address}
            </div>
          </div>
          <div>
            <div className="info-section-time">Thời gian nhận:</div>
            {new Date(order[0].date).toLocaleString()}
          </div>
        </div>
        <div className="info-section-paymentMethod">
          <span>
            <CardIcon /> HÌNH THỨC THANH TOÁN
          </span>
          <p>
            {order[0].paymentMethod === "bank"
              ? "Chuyển khoản"
              : "Thanh toán khi nhận hàng"}
          </p>
        </div>
      </div>
      <div className="product-info">
        <h3>THÔNG TIN SẢN PHẨM</h3>
        {order.map((item) => (
          <div key={item.product_id} className="product-card">
            <img
              src={`${BASE_URL}/uploads/products/${item.image}`}
              alt={item.name}
            />
            <div className="product-details d-flex justify-content-between align-self-center">
              <h4>{item.name}</h4>
              <p>
                <strong>Giá:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price)}
              </p>
              <p>
                <strong>Số lượng:</strong> {item.quantity}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.total || 0)}
              </p>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className=" btn btn-danger action-button cancel-button p-2"
                  onClick={() => handleCancelOrder(item.order_id)} // Gọi đúng orderId
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="order-summary">
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(
            order.reduce((total, item) => total + item.price * item.quantity, 0)
          )}
        </p>
        <Button colorScheme="red" onClick={() => navigate("/orderhistory")}>
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
