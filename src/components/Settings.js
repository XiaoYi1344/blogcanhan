import React, { useState } from "react";
import axios from "axios"; // Thêm axios để gọi API
import "./Settings.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5000/api/users"; // Thay bằng API backend của bạn

const Settings = () => {
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      if (password) {
        // Gửi yêu cầu đổi mật khẩu với xác nhận email
        await axios.post(`${API_URL}/request-password-reset`, { email });

        setMessage("Vui lòng kiểm tra email để xác nhận thay đổi mật khẩu!");
      } else {
        // Cập nhật thông tin người dùng
        await axios.put(`${API_URL}/update-profile`, { displayName, email });

        setMessage("Cài đặt đã được cập nhật!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      setMessage("Lỗi khi cập nhật thông tin!");
    }
  };

  return (
    <div className="settings-container container mt-5">
      <h2 className="text-center mb-4">Cài đặt tài khoản</h2>
      {message && <p className="alert alert-success">{message}</p>}

      <div className="avatar-section text-center">
        <img src={avatar} alt="Avatar" className="avatar-preview mb-3" />
        <input type="file" accept="image/*" onChange={handleAvatarChange} className="form-control" />
      </div>

      <form className="settings-form">
        <div className="mb-3">
          <label className="form-label">Tên hiển thị</label>
          <input type="text" className="form-control" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="button" className="btn btn-primary w-100" onClick={handleSave}>
          Lưu cài đặt
        </button>
      </form>
    </div>
  );
};

export default Settings;
