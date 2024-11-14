import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../service/api/users";
import "./ClientProfile.css";

const Profile = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const googleUser = JSON.parse(localStorage.getItem("googleUser"));

    if (userData) {
      // Đăng nhập thông thường
      setValues({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        avatar: userData.avatar || "https://via.placeholder.com/150",
      });
    } else if (googleUser) {
      // Đăng nhập qua Google
      setValues({
        name: googleUser.name || "",
        email: googleUser.email || "",
        phone: googleUser.phone || "",
        avatar: googleUser.avatar || "https://via.placeholder.com/150",
      });
    } else {
      // Nếu không có thông tin người dùng, chuyển hướng về trang đăng nhập
      navigate("/signin");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!values.name) newErrors.name = "Họ tên là bắt buộc.";
    if (!values.email) newErrors.email = "Email là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(values.email))
      newErrors.email = "Email không hợp lệ.";
    if (!values.phone) newErrors.phone = "Số điện thoại là bắt buộc.";
    else if (!/^\d{10}$/.test(values.phone))
      newErrors.phone = "Số điện thoại không hợp lệ.";
    return newErrors;
  };

  const handleSave = async (field, e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || !userData.id) {
        throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      }

      const userId = userData.id;
      const payload = { [field]: values[field] };

      const response = await updateUser(userId, payload);
      if (response) {
        userData[field] = values[field];
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Thông tin đã được cập nhật thành công.");
        setIsEditing((prev) => ({ ...prev, [field]: false }));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin", error);
      alert(error.message || "Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  const handleChange = (e, field) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="Profile">
      <div className="profile-container">
        <div className="profile-container1">
          <img src={values.avatar} alt="Avatar" className="avatar" />
          <h3>{values.name}</h3>
          <p>{values.email}</p>
        </div>
        <button className="logout-button" onClick={() => navigate("/login")}>
          Đăng xuất
        </button>
        <div className="profile-info">
          <h4>Thông tin cá nhân</h4>
          {["name", "email", "phone"].map((key) => (
            <div className="profile-info-item" key={key}>
              <label>
                {key === "name" ? "Họ tên" : key === "email" ? "Email" : "Số điện thoại"}:
              </label>
              {isEditing[key] ? (
                <input
                  type="text"
                  value={values[key]}
                  onChange={(e) => handleChange(e, key)}
                />
              ) : (
                <span>{values[key]}</span>
              )}
              {isEditing[key] ? (
                <button
                  className="save-button"
                  onClick={(e) => handleSave(key, e)}
                >
                  Lưu
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(key)}
                >
                  Sửa
                </button>
              )}
              {errors[key] && <span className="error-text">{errors[key]}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
