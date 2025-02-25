import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook for redirection

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Đăng ký thành công! Hãy đăng nhập.");
    } else {
      setMessage(data.message);
    }
  };

  // Handle redirect to login page
  const handleGoToLogin = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Đăng ký</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button type="submit">Đăng ký</button>
        </form>
        <p>{message}</p>

        {/* Button to navigate to Login page */}
        <button onClick={handleGoToLogin}>Đã có tài khoản? Đăng nhập</button>
      </div>
    </div>
  );
};

export default Register;
