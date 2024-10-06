import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import './SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  
  // Thêm khai báo trạng thái cho modal thành công và thất bại
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const validateForm = () => {
    const nonVietnameseRegex = /^[a-zA-Z0-9]*$/;
  
    if (!username.trim()) {
      return 'Tên đăng nhập không được bỏ trống.';
    }
    if (!nonVietnameseRegex.test(username)) {
      return 'Tên đăng nhập không được chứa ký tự tiếng Việt.';
    }
  
    if (!name.trim()) {
      return 'Tên người dùng không được bỏ trống.';
    }
  
    if (!email.trim()) {
      return 'Email không được bỏ trống.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Email không hợp lệ.';
    }
    if (!nonVietnameseRegex.test(password)) {
      return 'Mật khẩu không được chứa ký tự tiếng Việt.';
    }
  
    if (password.length < 6) {
      return 'Mật khẩu phải ít nhất 6 ký tự.';
    }
    if (password !== confirmPassword) {
      return 'Mật khẩu xác thực không khớp.';
    }
  
    if (!phone.trim()) {
      return 'Số điện thoại không được bỏ trống.';
    }
    if (!/^\d{10,15}$/.test(phone)) {
      return 'Số điện thoại không hợp lệ. (10-15 chữ số)';
    }
  
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    const formError = validateForm();
    if (formError) {
      setError(formError);
      setShowErrorModal(true);
      return;
    }

    // Submit registration data
    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, name, email, password, phone })
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
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate('/signin'); 
      }, 3000);
    })    
    .catch(error => {
      setError(error.message || 'Có lỗi xảy ra');
      setShowErrorModal(true);
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

          <label htmlFor="name">Họ tên:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

      {showSuccessModal && (
        <SuccessModal
          message="Đăng ký thành công!"
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/signin');
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

export default SignUp;
