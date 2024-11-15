import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import './SignIn.css';

const SignIn = () => {
  // State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  // Xử lý đăng nhập Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  // Gửi yêu cầu đăng nhập
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Đăng nhập không thành công');
        return response.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', username);
          localStorage.setItem('userData', JSON.stringify(data.user)); // Lưu thông tin người dùng
          localStorage.setItem('userId', data.users.id);
          setShowSuccessModal(true);
          setTimeout(() => navigate('/'), 2000);
        } else {
          setError(data.message || 'Đăng nhập thất bại');
          setShowErrorModal(true);
          setTimeout(() => setShowErrorModal(false), 2000);
        }
      })
      .catch(() => {
        setError('Có lỗi xảy ra');
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 2000);
      });
  };


  return (
    <div className="signin-container">
      <div className="signin-box">
        <header className="signin-header">
          <h1>Đăng nhập</h1>
        </header>

        <section className="signin-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
            </div>

            <button type="submit" className="btn-submit">Đăng nhập</button>
          </form>

          <button type="button" className="btn-submit google-login" onClick={handleGoogleLogin}>
            Đăng nhập bằng Google
          </button>

          {error && <p className="error-message">{error}</p>}

          <div className="signin-links">
            <a href="/forgot-password">Quên mật khẩu?</a>
            <p className="signup-link">Chưa có tài khoản? <a href="/signup">Đăng ký</a></p>
          </div>
        </section>
      </div>

      {showSuccessModal && (
        <SuccessModal
          message="Đăng nhập thành công!"
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/');
          }}
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

export default SignIn;
