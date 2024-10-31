import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lockErrorMessage, setLockErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn sự kiện mặc định của form để trang không bị tải lại.
  
    // Gửi yêu cầu đăng nhập đến server.
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Đăng nhập không thành công');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Kiểm tra nội dung của đối tượng data
      if (data.token) {
        // Lưu token và tất cả dữ liệu của tài khoản vào local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Nếu bạn vẫn muốn lưu username riêng
        localStorage.setItem('username', username);
        
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/'); // Chuyển hướng sau 2-3 giây
        }, 2000);
      } else {
        setError(data.message || 'Đăng nhập thất bại');
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Có lỗi xảy ra');
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
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

            {error && <p className="error-message">{error}</p>}

            <div className="signin-links">
              <a href="/forgot-password">Quên mật khẩu?</a>
              <p className="signup-link">Chưa có tài khoản? <a href="/signup">Đăng ký</a></p>
            </div>
          </form>

          <div className="social-login">
            <button className="social-btn google-login">Đăng nhập bằng Google</button>
            <button className="social-btn facebook-login">Đăng nhập bằng Facebook</button>
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
          message={lockErrorMessage || error}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default SignIn;