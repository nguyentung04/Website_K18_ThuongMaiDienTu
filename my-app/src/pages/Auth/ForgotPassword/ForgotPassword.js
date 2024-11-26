import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../../components/Modals/SuccessModal";
import ErrorModal from "../../../components/Modals/ErrorModal";
import { forgotPassword } from "../../../service/api/users";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await forgotPassword(email);

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/signin");
        }, 3000);
      } else {
        setError(data.message || "Yêu cầu thất bại. Vui lòng thử lại.");
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <header className="forgot-password-header">
          <h1>Quên mật khẩu</h1>
        </header>

        <section className="forgot-password-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Nhập địa chỉ email của bạn:</label>
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Gửi yêu cầu
            </button>
          </form>
        </section>

        {error && <p className="error-message">{error}</p>}
      </div>

      {showSuccessModal && (
        <SuccessModal
          message="Yêu cầu khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn."
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={error}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
