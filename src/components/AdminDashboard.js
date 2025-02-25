import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Parallax } from 'react-parallax';
import './AdminDashboard.css';  // Make sure you have this CSS file

const AdminDashboard = () => {
  const [stats, setStats] = useState({});  // Initialize state for stats
  const navigate = useNavigate();

  // Fetch statistics on component mount
  useEffect(() => {
    fetch('/api/stats')
      .then(response => response.json())
      .then(data => {
        setStats(data); // Update state with API response
      })
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="container-fluid custom-bg">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">Admin Dashboard</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/admin" className="nav-link">🏠 Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link to="/manager-users" className="nav-link">👥 Quản lý người dùng</Link>
              </li>
              <li className="nav-item">
                <Link to="/manager-posts" className="nav-link">📝 Quản lý bài viết</Link>
              </li>
              <li className="nav-item">
                <Link to="/manager-staff" className="nav-link">🔧 Quản lý nhân viên</Link>
              </li>
              <li className="nav-item">
                <Link to="/add-post" className="nav-link">➕ Thêm bài viết</Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link">⚙️ Cài đặt</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-custom d-flex">🚪 Đăng xuất</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Parallax effect */}
      <Parallax bgImage="path-to-image.jpg" strength={300}>
        <div className="parallax-content">
          <h1 className="text-center text-light">Chào mừng bạn đến với Dashboard!</h1>
          <p className="text-center text-light">Quản lý người dùng, bài viết và nhiều tính năng khác.</p>
        </div>
      </Parallax>

      {/* Dashboard Content */}
      <div className="container mt-4">
        <h3 className="text-center text-light">Chào mừng bạn đến với Dashboard!</h3>
        <p className="text-center text-light">Quản lý người dùng, bài viết và nhiều tính năng khác.</p>

        {/* Overview Stats Section */}
        <div className="row text-center mt-5">
          <div className="col-md-3">
            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <h4 className="card-title">Người dùng</h4>
                <p className="card-text">Số lượng người dùng hiện tại: {stats.users}</p> {/* Dynamic stat */}
                <Link to="/manager-users" className="btn btn-custom">Xem chi tiết</Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <h4 className="card-title">Bài viết</h4>
                <p className="card-text">Số lượng bài viết: {stats.posts}</p> {/* Dynamic stat */}
                <Link to="/manager-posts" className="btn btn-custom">Xem chi tiết</Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <h4 className="card-title">Nhân viên</h4>
                <p className="card-text">Số lượng nhân viên: {stats.staff}</p> {/* Dynamic stat */}
                <Link to="/manager-staff" className="btn btn-custom">Xem chi tiết</Link>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <h4 className="card-title">Thông báo</h4>
                <p className="card-text">Thông báo quan trọng cho quản trị viên</p>
                <Link to="/settings" className="btn btn-custom">Xem chi tiết</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Other sections like statistics, charts, etc. */}
        <div className="row mt-5">
          <div className="col-md-12">
            <div className="alert alert-info" role="alert">
              📊 Bạn có thể xem các thống kê về hiệu suất và tiến độ công việc của các bài viết và người dùng trong Dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
