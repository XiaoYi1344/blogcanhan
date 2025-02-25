import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/reset-password", { token, newPassword });
      setMessage("Mật khẩu đã được đặt lại thành công!");
    } catch (error) {
      setMessage("Lỗi khi đặt lại mật khẩu!");
    }
  };

  return (
    <div className="container">
      <h2>Đặt lại mật khẩu</h2>
      {message && <p>{message}</p>}
      <input type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button onClick={handleReset}>Xác nhận</button>
    </div>
  );
};

export default ResetPassword;
