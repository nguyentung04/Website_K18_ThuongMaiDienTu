import React from 'react';
import './PaymentSuccess.css'; // Tạo file CSS riêng để quản lý giao diện
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/'); // Điều hướng về trang chủ hoặc trang khác tuỳ ý
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon">&#10004;</div> {/* Biểu tượng thành công */}
        <h1>Thanh toán thành công!</h1>
        <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
        <button className="continue-button" onClick={handleContinueShopping}>
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
