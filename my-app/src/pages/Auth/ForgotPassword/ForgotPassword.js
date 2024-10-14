import React, { useState } from 'react';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không thể gửi yêu cầu');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 2000);
        } else {
          setError(data.message || 'Yêu cầu thất bại');
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Có lỗi xảy ra');
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
      });
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit">Gửi yêu cầu</button>

            {error && <p className="error-message">{error}</p>}
          </form>
        </section>
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