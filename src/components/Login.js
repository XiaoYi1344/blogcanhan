import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Vui lòng nhập email và mật khẩu!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Dữ liệu trả về từ API:", data);

      setLoading(false);

      if (response.ok) {
        // Kiểm tra data.user có tồn tại không
        if (data.user && data.user.role) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role); 
      
          setMessage("Đăng nhập thành công!");
          
          // Debug log
          console.log("User Role:", data.user.role);
          console.log("Token:", data.token);
      
          // Dùng setTimeout để đảm bảo navigate hoạt động sau khi setItem
          setTimeout(() => {
            if (data.user.role === "admin") {
              console.log("Navigating to Admin Dashboard");
              navigate("/admin");
            } else if (data.user.role === "writer") {
              console.log("Navigating to Home Page");
              navigate("/home");
            } else {
              setMessage("Role không hợp lệ!");
            }
          }, 100); // Delay 100ms giúp React xử lý cập nhật state
        } else {
          setMessage("Dữ liệu role không hợp lệ!");
        }
      } else {
        setMessage(data.message || "Đăng nhập thất bại");
      }
      
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
      setMessage("Lỗi kết nối đến server!");
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <button onClick={handleGoToRegister}>Đăng ký tài khoản</button>
      </div>
    </div>
  );
};

export default Login;
