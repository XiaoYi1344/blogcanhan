import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './ManagerPost.css';

const API_URL = "http://localhost:5000/api/posts/check";

function ManagerPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch posts for admin
  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((response) => {
        console.log("Dữ liệu trả về từ API:", response.data);
        setPosts(response.data);  // Lưu tất cả bài viết
        setLoading(false);
      })
      .catch((error) => {
        setError("Lỗi khi lấy danh sách bài viết");
        setLoading(false);
      });
  }, []);

  // Delete post
  const handleDelete = async (id) => {
    console.log("Deleting post with id:", id);
    try {
      setPosts((prev) => prev.filter((post) => post._id !== id));

      const response = await axios.delete(`${API_URL}/${id}`);
      console.log("Post deleted successfully:", response.data);
    } catch (error) {
      console.error("Error while deleting post:", error.response || error.message);
      setError("Lỗi khi xóa bài viết");

      setPosts((prev) => {
        const postToRevert = prev.find((post) => post._id === id);
        if (postToRevert) {
          return [...prev, postToRevert];
        }
        return prev;
      });
    }
  };

  // Approve post
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("Response từ API:", response.data); // Kiểm tra phản hồi từ API
  
      setPosts((prev) =>
        prev.map((post) =>
          post._id === id ? { ...post, status: "approved" } : post
        )
      );
    } catch (error) {
      console.error("Lỗi khi duyệt bài viết:", error);
      setError("Lỗi khi duyệt bài viết");
    }
  };
  

  // View post details
  const handleViewDetails = (post) => {
    alert(`
      Tiêu đề: ${post.title}
      Tác giả: ${post.author?.name || "Không xác định"}
      Ngày đăng: ${new Date(post.createdAt).toLocaleDateString()}
      Tình trạng: ${post.status === "approved" ? "Đã duyệt" : "Chưa duyệt"}
      Nội dung: ${post.content}
    `);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="manager-posts">
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

      <h1>Danh Sách Bài Viết</h1>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Đang tải bài viết...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id} className="post-item">
              <h2>{post.title}</h2>
              <p>{post.content.slice(0, 100)}...</p>
              <button onClick={() => handleViewDetails(post)}>Xem Chi Tiết</button>
              <div className="status">
                {post.status === "approved" ? (
                  <span className="approved">Đã duyệt</span>
                ) : (
                  <span className="pending">Chưa duyệt</span>
                )}
              </div>
              {post.status !== "approved" && (
                <button onClick={() => handleApprove(post._id)}>Duyệt</button>
              )}
              <button onClick={() => handleDelete(post._id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManagerPosts;
