import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const validateForm = () => {
    if (!username.trim()) {
      return 'Tên đăng nhập không được bỏ trống.';
    }
    if (!email.trim()) {
      return 'Email không được bỏ trống.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Email không hợp lệ.';
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

    // Validate form data
    const formError = validateForm();
    if (formError) {
      setError(formError);
      return;
    }

    // Submit registration data
    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Đăng ký không thành công');
        });
      }
      return response.json();
    })
    .then(data => {
      alert(data.message || 'Đăng ký thành công!');
      navigate('/signin'); // Chuyển hướng đến trang đăng nhập
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message || 'Có lỗi xảy ra');
    });
  };

  return (
    <div className="signup">
      <header className="signup-header">
        <h1>Đăng ký</h1>
      </header>
      <section className="signup-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
};

export default SignUp;
