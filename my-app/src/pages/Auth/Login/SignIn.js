import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Đăng nhập không thành công');
      }
      return response.json();
    })
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        setShowSuccessModal(true); // Hiển thị modal thành công
        setTimeout(() => {
          navigate('/'); // Chuyển hướng sau 2-3 giây
        }, 2000);
      } else {
        setError(data.message || 'Đăng nhập thất bại');
        setShowErrorModal(true); // Hiển thị modal thất bại
        setTimeout(() => {
          setShowErrorModal(false); // Đóng modal sau 2-3 giây
        }, 2000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Có lỗi xảy ra');
      setShowErrorModal(true); // Hiển thị modal thất bại
      setTimeout(() => {
        setShowErrorModal(false); // Đóng modal sau 2-3 giây
      }, 2000);
    });
  };

  return (
    <div className="signin">
      <header className="signin-header">
        <h1>Đăng nhập</h1>
      </header>
      <section className="signin-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Đăng nhập</button>

          {error && <p className="error-message">{error}</p>}

          <p className="signup-link">
            Chưa có tài khoản? <a href="/signup">Đăng ký</a>
          </p>
        </form>
        <div className="social-login">
          <button className="google-login" onClick={() => { /* Google login */ }}>
            Đăng nhập bằng Google
          </button>
          <button className="facebook-login" onClick={() => { /* Facebook login */ }}>
            Đăng nhập bằng Facebook
          </button>
        </div>
      </section>

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
