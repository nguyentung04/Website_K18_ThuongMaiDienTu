import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import SuccessModal from '../../../components/Modals/SuccessModal'; // Import modal thành công

const SignUp = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Lưu thông báo thành công
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      return 'Họ và tên không được bỏ trống.';
    }
    if (!username.trim()) {
      return 'Tên đăng nhập không được bỏ trống.';
    }
    if (!email.trim()) {
      return 'Email không được bỏ trống.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Email không hợp lệ.';
    }
    if (!phone.trim()) {
      return 'Số điện thoại không được bỏ trống.';
    }
    if (password.length < 6) {
      return 'Mật khẩu phải ít nhất 6 ký tự.';
    }
    if (password !== confirmPassword) {
      return 'Mật khẩu xác thực không khớp.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formError = validateForm();
    if (formError) {
      setError(formError);
      return;
    }

    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, name, phone }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Đăng ký không thành công');
          });
        }
        return response.json();
      })
      .then((data) => {
        setSuccessMessage(data.message || 'Đăng ký thành công!');
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message || 'Có lỗi xảy ra');
      });
  };

  const handleModalClose = () => {
    setSuccessMessage('');
    navigate('/signin'); 
  };

  return (
    <div className="signup">
      <header className="signup-header">
        <h1>Đăng ký</h1>
      </header>
      <section className="signup-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Họ và tên:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirm-password">Xác thực mật khẩu:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Đăng ký</button>

          {error && <p className="error-message">{error}</p>}

          <p className="signin-link">
            Đã có tài khoản? <a href="/signin">Đăng nhập</a>
          </p>
        </form>
      </section>

      {/* Modal thành công */}
      {successMessage && (
        <SuccessModal message={successMessage} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default SignUp;
