import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap"; // Import Bootstrap Spinner for loading effect
import './ManagerUser.css';

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch users data from API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users?role=writer")
      .then((res) => {
        setUsers(res.data);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((err) => {
        console.error("Error fetching writers:", err);
        setLoading(false); // Stop loading on error
      });
  }, []);

  // View user details
  const handleViewDetails = (userId) => {
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => alert(JSON.stringify(res.data, null, 2)))
      .catch((err) => console.error("Error fetching user details:", err));
  };

  // Block user for posting or commenting
  const handleBlockUser = async (userId, actionType) => {
    const reason = prompt(`Enter reason for blocking ${actionType === "addPost" ? "post" : "comment"}:`);
    if (!reason) return;

    const duration = prompt("Enter block duration (in minutes):");
    if (!duration || isNaN(duration) || duration <= 0) return alert("Invalid duration!");

    const blockUntil = new Date(Date.now() + duration * 60000);

    try {
      await axios.put(`http://localhost:5000/api/users/block/${userId}`, {
        actionType,
        reason,
        blockUntil,
      });

      alert(`Blocked ${actionType === "addPost" ? "posting" : "commenting"} for user ${userId}`);

      // Update UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, blockedActions: { ...user.blockedActions, [actionType]: { reason, blockUntil } } }
            : user
        )
      );
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    navigate("/login"); // Navigate to login page
  };

  return (
    <div>
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

      <h2>Quản lý người dùng</h2>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <table className="table table-bordered table-hover mt-4">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Số bài viết</th>
              <th>Lượt theo dõi</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.postCount || 0}</td>
                <td>{user.followers || 0}</td>
                <td>
                  {user.blockedActions?.addPost && new Date(user.blockedActions.addPost.blockUntil) > new Date() ? (
                    <span className="text-danger">Chặn đăng bài (Lý do: {user.blockedActions.addPost.reason})</span>
                  ) : null}
                  {user.blockedActions?.comment && new Date(user.blockedActions.comment.blockUntil) > new Date() ? (
                    <span className="text-danger d-block">
                      Chặn bình luận (Lý do: {user.blockedActions.comment.reason})
                    </span>
                  ) : null}
                </td>
                <td>
                  <button className="btn btn-info me-2" onClick={() => handleViewDetails(user._id)}>Xem chi tiết</button>
                  <button className="btn btn-warning me-2" onClick={() => handleBlockUser(user._id, "addPost")}>Chặn đăng bài</button>
                  <button className="btn btn-danger" onClick={() => handleBlockUser(user._id, "comment")}>Chặn bình luận</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagerUsers;
