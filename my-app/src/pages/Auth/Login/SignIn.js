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
  

  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng người dùng sau khi đăng nhập thành công.

  // Hàm xử lý sự kiện khi người dùng submit form.
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
    <div className="signin">
      {/* Header của trang đăng nhập */}
      <header className="signin-header">
        <h1>Đăng nhập</h1>
      </header>

      {/* Form đăng nhập */}
      <section className="signin-form">
        <form onSubmit={handleSubmit}>
          {/* Nhãn và ô nhập cho tên đăng nhập */}
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="username"
            value={username} // Giá trị được lấy từ state username.
            onChange={(e) => setUsername(e.target.value)} // Cập nhật state khi người dùng thay đổi giá trị.
            required // Trường này là bắt buộc.
          />
          {/* Nhãn và ô nhập cho mật khẩu */}
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password} // Giá trị được lấy từ state password.
            onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi người dùng thay đổi giá trị.
            required // Trường này là bắt buộc.
          />
          {/* Nút gửi form */}
          <button type="submit">Đăng nhập</button>
          {/* Hiển thị thông báo lỗi nếu có */}
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Kiểm tra nếu có lỗi thì hiển thị lỗi */}
          {/* Liên kết tới trang đăng ký nếu người dùng chưa có tài khoản */}
          <p className="signup-link">
            Chưa có tài khoản? <a href="/signup">Đăng ký</a>
          </p>
        </form>

        {/* Đăng nhập bằng các phương thức xã hội (Google, Facebook) */}
        <div className="social-login">
          <button
            className="google-login"
            onClick={() => {
              /* Google login */
            }}
          >
            Đăng nhập bằng Google
          </button>
          <button
            className="facebook-login"
            onClick={() => {
              /* Facebook login */
            }}
          >
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