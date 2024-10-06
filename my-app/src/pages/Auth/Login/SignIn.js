import React, { useState } from "react"; // Import React và hook useState để quản lý trạng thái.
import { useNavigate } from "react-router-dom"; // Hook useNavigate dùng để điều hướng trang.
import "./SignIn.css"; // Import file CSS cho component.

const SignIn = () => {
  // Khai báo các state để lưu giá trị tên đăng nhập, mật khẩu, và thông báo lỗi.
  const [username, setUsername] = useState(""); // Trạng thái lưu trữ tên đăng nhập người dùng.
  const [password, setPassword] = useState(""); // Trạng thái lưu trữ mật khẩu người dùng.
  const [error, setError] = useState(""); // Trạng thái lưu trữ thông báo lỗi nếu có lỗi xảy ra.

  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng người dùng sau khi đăng nhập thành công.

  // Hàm xử lý sự kiện khi người dùng submit form.
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn sự kiện mặc định của form để trang không bị tải lại.

    // Gửi yêu cầu đăng nhập đến server.
    fetch("http://localhost:3000/api/login", {
      // API URL để thực hiện yêu cầu đăng nhập.
      method: "POST", // Phương thức POST để gửi dữ liệu.
      headers: {
        "Content-Type": "application/json", // Đặt header để chỉ định dữ liệu dưới dạng JSON.
      },
      body: JSON.stringify({ username, password }), // Chuyển đổi dữ liệu username và password thành chuỗi JSON để gửi đi.
    })
      .then((response) => {
        // Kiểm tra nếu phản hồi từ server không thành công (không phải mã 200).
        if (!response.ok) {
          throw new Error("Đăng nhập không thành công"); // Ném ra lỗi nếu đăng nhập không thành công.
        }
        return response.json(); // Chuyển đổi phản hồi từ JSON.
      })
      .then((data) => {
        // Kiểm tra nếu server trả về token đăng nhập.
        if (data.token) {
          // Lưu token vào localStorage để duy trì trạng thái đăng nhập.
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", username); // Lưu tên đăng nhập vào localStorage.
          alert("Đăng nhập thành công!"); // Thông báo thành công.
          navigate("/"); // Điều hướng người dùng về trang chủ sau khi đăng nhập thành công.
        } else {
          // Nếu không có token, hiển thị thông báo lỗi.
          setError(data.message || "Đăng nhập thất bại"); // Hiển thị lỗi trả về từ server hoặc lỗi mặc định.
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Hiển thị lỗi trong console (chỉ sử dụng cho việc debug).
        setError("Có lỗi xảy ra"); // Hiển thị lỗi chung khi có sự cố với yêu cầu.
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
    </div>
  );
};

export default SignIn;
