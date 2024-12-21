import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword, updateUser } from "../../../service/api/users";
import SuccessModal from "../../../components/Modals/SuccessModal";
import "./ClientProfile.css";
import { Table, Tbody, Tr, Td, Img } from "@chakra-ui/react";const Profile = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    matKhau: "",
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decoded = JSON.parse(window.atob(base64));
      console.log(decoded);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true
    }
  };


  const decodeUtf8 = (str) => {
    try {
      return decodeURIComponent(escape(str));
    } catch (e) {
      console.error("Error decoding UTF-8:", e);
      return str;
    }
  };
    
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (token && !isTokenExpired(token)) {
      if (!userData) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const decoded = JSON.parse(window.atob(base64));

        console.log("Dữ liệu JWT gốc:", decoded);

        const newUserData = {
          id: decoded.id,
          name: decodeUtf8(decoded.name),
          email: decoded.email,
          phone: decoded.phone,
          google_id: decoded.google_id,
        };

        console.log("Dữ liệu giải mã:", newUserData);

        localStorage.setItem("userData", JSON.stringify(newUserData));

        const storedData = JSON.parse(localStorage.getItem("userData"));
        setValues({
          name: storedData.name || "",
          email: storedData.email || "",
          phone: storedData.phone || "",
          avatar: storedData.avatar || "https://via.placeholder.com/150",
        });
      } else {
        setValues({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          avatar: userData.avatar || "https://via.placeholder.com/150",
        });
      }
    } else {
      navigate("/signin");
    }
  }, [navigate]);


  const validateField = (field, value) => {
    let error = "";
    if (!value) {
      error = `${field === "name"
        ? "Họ tên"
        : field === "email"
          ? "Email"
          : "Số điện thoại"
        } là bắt buộc.`;
      if (field === "email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
        error = "Email không hợp lệ.";
      }
    } else if (field === "phone" && !/^\d{10}$/.test(value)) {
      error = "Số điện thoại không hợp lệ.";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSave = async (field, e) => {
    e.preventDefault();
    if (errors[field]) return;

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || !userData.id) {
        throw new Error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
      }

      const userId = userData.id;
      const payload = { [field]: values[field] };
      const response = await updateUser(userId, payload);

      if (response) {
        userData[field] = values[field];
        localStorage.setItem("userData", JSON.stringify(userData));
        setSuccessMessage("Thông tin đã được cập nhật thành công.");
        setIsEditing((prev) => ({ ...prev, [field]: false }));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin", error);
      setSuccessMessage("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwords;

    setErrors({});

    let validationErrors = {};

    if (!currentPassword) {
      validationErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc.";
    }

    if (!newPassword) {
      validationErrors.newPassword = "Mật khẩu mới là bắt buộc.";
    } else if (newPassword.length < 6) {
      validationErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }

    if (newPassword !== confirmNewPassword) {
      validationErrors.confirmNewPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || !userData.id) {
        throw new Error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
      }
      await updatePassword(userData.id, passwords);

      setSuccessMessage("Mật khẩu đã được thay đổi thành công.");
      setShowChangePassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      setSuccessMessage(
        error.response?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu."
      );
    }
  };

  const handleModalClose = () => {
    setSuccessMessage("");
  };

  return (
    <div className="Profile">
      <div className="profile-container">
      <Table>
        <div className="profile-container1">
          <Td>
              <Img
                src={`http://localhost:3000/uploads/users/${values.image}`}
                boxSize="50px"
                objectFit="cover"
                borderRadius="full"
                alt=""
              />
            </Td>
            <h3>{values.name}</h3>
            <p>{values.email}</p>
          </div>
        <button className="logout-button" onClick={() => navigate("/signin")}>
          Đăng xuất
        </button>
        </Table>
      </div>

      <div className="personal-info">

        {Object.entries(values)
          .filter(([key]) => key !== "avatar")
          .map(([key, value]) => (
            <div key={key} className="info-item d-flex justify-content-between">
              <label>
                {key === "name"
                  ? "Họ và tên :"
                  : key === "email"
                    ? "Email :"
                    : key === "phone"
                      ? "Số điện thoại :"
                      : ""}
              </label>
              {isEditing[key] ? (
                <form
                  className={`edit-form ${isEditing[key] ? "open" : ""}`}
                  onSubmit={(e) => handleSave(key, e)}
                >
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(e, key)}
                    className={errors[key] ? "input-error" : ""}
                  />
                  <div className="button-form">
                    <button
                      type="submit"
                      className="button-form-save"
                      disabled={!!errors[key]}
                    >
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
                  <span>{value}</span>
                  <button onClick={() => handleEditClick(key)}>Sửa</button>
                </div>
              )}
              {errors[key] && <span className="error-text">{errors[key]}</span>}
            </div>
          ))}

        <button
          className="change-password-button"
          onClick={() => setShowChangePassword(true)}
        >
          Đổi mật khẩu
        </button>

        {showChangePassword && (
          <div className="change-password-form">
            <form onSubmit={handleChangePassword}>
              <div className="change-password-form-checkin d-flex justify-content-between">
                <label>Mật khẩu hiện tại:</label>
                <input
                  className="Present-password"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                />
                {errors.currentPassword && (
                  <span className="error-text">{errors.currentPassword}</span>
                )}
              </div>
              <div className="change-password-form-checkin d-flex justify-content-between">
                <label>Mật khẩu mới:</label>
                <input
                  className="Present-password"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value,
                    })
                  }
                />
                {errors.newPassword && (
                  <span className="error-text">{errors.newPassword}</span>
                )}
              </div>
              <div className="change-password-form-checkin d-flex justify-content-between">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  className="Present-password"
                  type="password"
                  value={passwords.confirmNewPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmNewPassword: e.target.value,
                    })
                  }
                />
                {errors.confirmNewPassword && (
                  <span className="error-text">{errors.confirmNewPassword}</span>
                )}
              </div>
              <div className="button-form">
                <button
                  type="submit"
                  className="button-form-save"
                  disabled={
                    !passwords.currentPassword ||
                    !passwords.newPassword ||
                    !passwords.confirmNewPassword
                  }
                >
                  Lưu mật khẩu
                </button>
                <button
                  type="button"
                  className="button-form-cancel"
                  onClick={() => setShowChangePassword(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Profile;
