import React, { useState } from "react";
import axios from "axios";
import "./ClientProfile.css";

const BASE_URL = "http://localhost:3000";

const Profile = () => {
  const [values, setValues] = useState({
    avatar: "https://via.placeholder.com/150",
    hoTen: "John Doe",
    email: "john.doe@example.com",
    matKhau: "password",
    ngaySinh: "1990-01-01",
    gioiTinh: "Nam",
    soDienThoai: "+1234567890",
    diaChi: "1234 Main St",
  });

  const [isEditing, setIsEditing] = useState({
    hoTen: false,
    email: false,
    matKhau: false,
    ngaySinh: false,
    gioiTinh: false,
    soDienThoai: false,
    diaChi: false,
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // State for changing password
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
// Hàm chuyển đổi chế độ chỉnh sửa cho từng trường thông tin
const handleEditClick = (field) => {
  setIsEditing((prev) => {
    // Đóng tất cả các trường đang chỉnh sửa và chỉ mở trường được click
    const newState = Object.keys(prev).reduce((acc, key) => {
      acc[key] = key === field ? !prev[field] : false; // Chỉ mở form chỉnh sửa của trường được chọn
      return acc;
    }, {});
    return newState;
  });
};

// Hàm xử lý khi có sự thay đổi giá trị trong các ô input
const handleChange = (e, field) => {
  // Cập nhật giá trị của trường đang chỉnh sửa vào state
  setValues((prev) => ({ ...prev, [field]: e.target.value }));
};

// Hàm lưu thông tin cập nhật khi người dùng nhấn nút lưu
const handleSave = async (field, e) => {
  e.preventDefault(); // Ngăn không cho trang load lại
  try {
    const payload = { [field]: values[field] }; // Tạo payload với giá trị trường cần lưu
    await axios.put(`${BASE_URL}/api/update_profile`, payload); // Gửi yêu cầu cập nhật profile tới API
    alert("Thông tin đã được cập nhật thành công."); // Thông báo khi cập nhật thành công
    setIsEditing((prev) => ({ ...prev, [field]: false })); // Đóng form chỉnh sửa sau khi lưu
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin", error); // Ghi log lỗi ra console
    alert("Đã xảy ra lỗi khi cập nhật thông tin."); // Thông báo khi xảy ra lỗi
  }
};

// Hàm xử lý xóa tài khoản
const handleDeleteAccount = async () => {
  try {
    // Xác thực mật khẩu trước khi xóa tài khoản
    const response = await axios.post(`${BASE_URL}/api/validate_password`, {
      password: deletePassword, // Gửi mật khẩu để xác thực
    });

    if (response.data.valid) { // Nếu mật khẩu hợp lệ
      if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản?")) { // Hiển thị thông báo xác nhận xóa tài khoản
        await axios.delete(`${BASE_URL}/api/delete_account`); // Gửi yêu cầu xóa tài khoản
        alert("Tài khoản đã được xóa thành công."); // Thông báo khi xóa thành công
        window.location.href = "/login"; // Điều hướng về trang đăng nhập
      }
    } else {
      alert("Mật khẩu không đúng. Vui lòng thử lại."); // Thông báo nếu mật khẩu sai
    }
  } catch (error) {
    console.error("Lỗi khi xác thực mật khẩu", error); // Ghi log lỗi ra console
    alert("Đã xảy ra lỗi khi xác thực mật khẩu."); // Thông báo khi xảy ra lỗi
  }
};

// Hàm xử lý khi người dùng đổi mật khẩu
const handleChangePassword = async (e) => {
  e.preventDefault(); // Ngăn không cho trang load lại
  if (passwords.newPassword !== passwords.confirmNewPassword) {
    alert("Mật khẩu mới không khớp. Vui lòng kiểm tra lại."); // Kiểm tra nếu mật khẩu mới và mật khẩu xác nhận không khớp
    return;
  }

  try {
    // Gửi yêu cầu đổi mật khẩu tới API
    const response = await axios.post(`${BASE_URL}/api/change_password`, {
      currentPassword: passwords.currentPassword, // Mật khẩu hiện tại
      newPassword: passwords.newPassword, // Mật khẩu mới
    });

    if (response.data.success) { // Nếu đổi mật khẩu thành công
      alert("Mật khẩu đã được thay đổi thành công."); // Thông báo thành công
      setShowChangePassword(false); // Ẩn form đổi mật khẩu
    } else {
      alert("Mật khẩu hiện tại không đúng."); // Thông báo nếu mật khẩu hiện tại không đúng
    }
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu", error); // Ghi log lỗi ra console
    alert("Đã xảy ra lỗi khi đổi mật khẩu."); // Thông báo khi xảy ra lỗi
  }
};


  return (
    <div className="Profile">
      <div className="profile-container">
        <div className="profile-container1">
          <img src={values.avatar} alt="Avatar" className="avatar" />
          <h3>{values.hoTen}</h3>
          <p>{values.email}</p>
        </div>
        <button className="logout-button">Đăng xuất</button>
      </div>

      <div className="personal-info">
        {Object.entries(values)
          .filter(([key]) => key !== "avatar")
          .map(([key, value]) => (
            <div key={key} className="info-item">
              <label>
                {key === "hoTen" && "Họ và tên :"}
                {key === "email" && "Email :"}
                {key === "matKhau" && "Mật khẩu : "}
                {key === "ngaySinh" && "Ngày sinh :"}
                {key === "gioiTinh" && "Giới tính :"}
                {key === "soDienThoai" && "Số điện thoại :"}
                {key === "diaChi" && "Địa chỉ :"}
              </label>

              {isEditing[key] ? (
                <form
                  className={`edit-form ${isEditing[key] ? "open" : ""}`}
                  onSubmit={(e) => handleSave(key, e)}
                >
                  <input
                    type={
                      key === "matKhau"
                        ? "password"
                        : key === "email"
                        ? "email"
                        : key === "ngaySinh"
                        ? "date"
                        : "text"
                    }
                    value={value}
                    onChange={(e) => handleChange(e, key)}
                  />
                  <div className="button-form">
                    <button type="submit" className="button-form-save">
                      Lưu
                    </button>
                    <button
                      type="button"
                      className="button-form-cancel"
                      onClick={() => handleEditClick(key)}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-item-actions">
                  <span>
                    {key === "matKhau"
                      ? isPasswordVisible
                        ? value
                        : "********"
                      : value}
                  </span>

                  {key === "matKhau" && (
                    <button
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? "Ẩn" : "Hiện"}
                    </button>
                  )}
                  {key !== "matKhau" && (
                    <button onClick={() => handleEditClick(key)}>Sửa</button>
                  )}
                </div>
              )}
            </div>
          ))}

        {/* đổi mật khẩu */}
        <button
          className="change-password-button"
          onClick={() => setShowChangePassword(true)}
        >
          Đổi mật khẩu
        </button>

        {showChangePassword && (
          <div className="change-password-form">
            <form onSubmit={handleChangePassword}>
              <div className="change-password-form-checkin">
                <label>Mật khẩu hiện tại:</label>
                <div className="change-password-form-input">
                  <input
                    className="Present-password"
                    type="password"
                    style={{ marginLeft: " 106px" }}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="change-password-form-checkin">
                <label>Mật khẩu mới:</label>
                <div className="change-password-form-input">
                  <input
                    style={{ marginLeft: " 112px" }}
                    className="new-password"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="change-password-form-checkin">
                {" "}
                <label>Xác nhận mật khẩu mới:</label>
                <div className="change-password-form-input">
                  <input
                    style={{ marginLeft: " 55px" }}
                    className="new-confirm-password"
                    type="password"
                    value={passwords.confirmNewPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmNewPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </form>
            <div className="form-button">
              <button className="button-form-save" type="submit">
                Đổi mật khẩu
              </button>
              <button
                className="button-form-cancel"
                onClick={() => setShowChangePassword(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* xóa tài khoản  */}
        <button
          onClick={() => setShowDeletePrompt(true)}
          className="delete-button"
        >
          Xóa tài khoản
        </button>

        {showDeletePrompt && (
          <div className="delete-prompt">
            <label>Xác thực mật khẩu:</label>
            <div className="delete-prompt-from">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <div className="btn">
                <button
                  className="button-form-save"
                  onClick={handleDeleteAccount}
                >
                  Đồng ý
                </button>
                <button
                  className="button-form-cancel"
                  onClick={() => setShowDeletePrompt(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
