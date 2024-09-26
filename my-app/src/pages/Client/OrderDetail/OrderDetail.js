import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import "./OrderDetail.css";
import { AddressIcon, CardIcon } from "../../../components/icon/icon";

// BASE_URL là địa chỉ API của bạn, đảm bảo rằng đường dẫn đúng với API mà bạn đang sử dụng
const BASE_URL = "http://localhost:3000";

const OrderDetail = () => {
    const { id } = useParams(); // Lấy id từ URL thông qua hook useParams
    const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng trang
    const [order, setOrder] = useState(null); // Khởi tạo state 'order' để lưu thông tin đơn hàng
    const [error, setError] = useState(null); // Khởi tạo state 'error' để lưu lỗi nếu có
    const [loading, setLoading] = useState(true); // Khởi tạo state 'loading' để quản lý trạng thái tải dữ liệu

    // useEffect được sử dụng để gọi API và lấy dữ liệu đơn hàng khi component được render lần đầu tiên
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Gọi API để lấy thông tin đơn hàng dựa trên id
                const response = await axios.get(`${BASE_URL}/api/orderByName1/${id}`, { timeout: 10000 });
                console.log("API Response:", response); // Log toàn bộ đối tượng phản hồi của API
                console.log("Response Data:", response.data); // Log dữ liệu từ phản hồi API
    
                setOrder(response.data); // Cập nhật state order với dữ liệu từ API
                console.log("Order Data:", response.data); // Log lại dữ liệu đơn hàng sau khi cập nhật state
            } catch (err) {
                console.error("Error fetching order:", err); // Log lỗi nếu có vấn đề khi gọi API
                setError("Có lỗi xảy ra khi lấy dữ liệu đơn hàng."); // Cập nhật state error với thông báo lỗi
            } finally {
                setLoading(false); // Sau khi hoàn tất (thành công hoặc thất bại), cập nhật trạng thái tải về false
            }
        };
    
        fetchOrder(); // Gọi hàm lấy dữ liệu
    }, [id]); // useEffect chỉ chạy khi id thay đổi
console.log(id.name); // Log tên người dùng từ id (nếu có)

    // Nếu đang tải dữ liệu, hiển thị thông báo tải
    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    // Nếu có lỗi, hiển thị thông báo lỗi
    if (error) {
        return <p className="error-message">{error}</p>;
    }

    // Nếu không có dữ liệu đơn hàng, hiển thị thông báo không có đơn hàng
    if (!order) {
        return <p>Không có đơn hàng nào.</p>;
    }

    // Trả về JSX hiển thị chi tiết đơn hàng
    return (
        <div className="order-detail-container">
            <h3>Chi tiết đơn hàng #{order.id}</h3>
            <div className="order-info">
                <div className="info-section">
                    <span> <AddressIcon />THÔNG TIN NHẬN HÀNG</span>
                    <div><div className="info-section-name">Người nhận:</div> {order.name} - {order.phone}</div>
                    <div><div className="info-section-address">Địa chỉ nhận:</div> <div className="info-section-address-content">{order.address}</div></div>
                    <div><div className="info-section-time">Thời gian nhận:</div> {order.date}</div>
                </div>
                <div className="info-section-paymentMethod">
                    <span><CardIcon /> HÌNH THỨC THANH TOÁN</span>
                    <p>{order.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Thanh toán khi nhận hàng'}</p>
                </div>
            </div>
            <div className="product-info">
                <h3>THÔNG TIN SẢN PHẨM</h3>
                <div className="product-card">
                    {order.product ? (
                        <>
                            {/* Hiển thị hình ảnh và thông tin sản phẩm */}
                            <img src={`${BASE_URL}/uploads/products/${order.product.img}`} alt={order.product.name} />
                            <div className="product-details">
                                <h4>{order.product.name}</h4>
                                <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.product.price)}</p>
                                <p><strong>Số lượng:</strong> {order.product.quantity}</p>
                                <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</p>
                            </div>
                            <button>Hủy</button>
                        </>
                    ) : (
                        <p>Thông tin sản phẩm không có sẵn.</p> // Hiển thị thông báo nếu không có sản phẩm
                    )}
                </div>
            </div>

            <div className="order-summary">
                {/* Hiển thị tổng tiền và nút quay lại */}
                <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</p>
                <Button colorScheme="red" onClick={() => navigate("/orderhistory")}>Quay lại</Button>
            </div>
        </div>
    );
};

export default OrderDetail;
