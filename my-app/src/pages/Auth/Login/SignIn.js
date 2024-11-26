import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../components/Modals/SuccessModal';
import ErrorModal from '../../../components/Modals/ErrorModal';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  // Kiểm tra token hết hạn
  const isTokenExpired = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decoded = JSON.parse(window.atob(base64));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Kiểm tra và xử lý token Google khi redirect về
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      navigate('/');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('token');

    if (googleToken) {
      try {
        const base64Url = googleToken.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const userInfo = JSON.parse(window.atob(base64));

        localStorage.setItem('token', googleToken);
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('userData', JSON.stringify({
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
          role: userInfo.role
        }));

        setShowSuccessModal(true);
        
        setTimeout(() => {
          navigate('/');
          window.history.replaceState({}, document.title, "/signin");
        }, 2000);
      } catch (decodeError) {
        console.error('Lỗi giải mã token:', decodeError);
        setError('Đã xảy ra lỗi khi xác thực');
        setShowErrorModal(true);
      }
    }
  }, [navigate]);

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    }
    
    if (!password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }

    if (Object.keys(errors).length > 0) {
      setErrorDetails(errors);
      return false;
    }

    return true;
  };

  // Đăng nhập bằng tài khoản thông thường
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra kết nối mạng
    if (!navigator.onLine) {
      setError('Không có kết nối mạng. Vui lòng kiểm tra lại.');
      setShowErrorModal(true);
      return;
    }

    // Validate form
    if (!validateForm()) {
      setShowErrorModal(true);
      return;
    }

    // Xử lý ghi nhớ đăng nhập
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    // Bắt đầu quá trình đăng nhập
    setIsLoading(true);
    setError('');
    setErrorDetails({});

    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      setIsLoading(false);
      if (!response.ok) throw new Error('Đăng nhập không thành công');
      return response.json();
    })
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('userData', JSON.stringify(data.user)); 
        
        setShowSuccessModal(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message || 'Đăng nhập thất bại');
        setShowErrorModal(true);
      }
    })
    .catch(error => {
      setIsLoading(false);
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
      setShowErrorModal(true);
      console.error('Lỗi đăng nhập:', error);
    });
  };

  // Xử lý load tên đăng nhập đã ghi nhớ
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

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
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorDetails(prev => ({...prev, username: ''}));
                }}
                required
              />
              {errorDetails.username && (
                <span className="error text-danger">{errorDetails.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorDetails(prev => ({...prev, password: ''}));
                }}
                required
              />
              {errorDetails.password && (
                <span className="error text-danger">{errorDetails.password}</span>
              )}
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

            <button 
              type="submit" 
              className="btn-submit mb-3"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <button 
            type="button" 
            className="btn-submit google-login"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Đăng nhập bằng Google
          </button>

          {error && <p className="error-message text-danger">{error}</p>}

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