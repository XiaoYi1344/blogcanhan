import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './AddPostPage.css';

const API_URL = "http://localhost:5000/api/posts/";

function AddPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [error, setError] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  // Fetch posts created by the logged-in user
  useEffect(() => {
    axios
      .get(`${API_URL}`)
      .then((response) => {
        setUserPosts(response.data);
      })
      .catch((error) => {
        setError("Lỗi khi lấy bài viết của bạn");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
  
    if (!token) {
      setError("Vui lòng đăng nhập trước khi thêm bài viết.");
      return;
    }
  
    try {
      const newPost = { title, content, category, image, video };
      const response = await axios.post(
        `${API_URL}/create`,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
  
      if (response.status === 201) {
        setTitle("");
        setContent("");
        setCategory("");
        setImage("");
        setVideo("");
        alert("Bài viết đã được tạo và đang chờ duyệt!");
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Lỗi khi thêm bài viết";
      setError(errorMessage);  // Hiển thị chi tiết lỗi từ backend
      console.error("Chi tiết lỗi:", error);
    }
  };

  const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
  
  return (
    <div className="add-post">
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
            <h1 className="create-post-title">Thêm Bài Viết</h1>
{error && <p className="error-message">{error}</p>}
<form onSubmit={handleSubmit} className="post-form">
  <label className="form-label">
    Tiêu đề:
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className="input-field"
    />
  </label>
  <label className="form-label">
    Nội dung:
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      required
      className="textarea-field"
    />
  </label>
  <label className="form-label">
    Danh mục:
    <input
      type="text"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      required
      className="input-field"
    />
  </label>
  <label className="form-label">
    Hình ảnh:
    <input
      type="text"
      value={image}
      onChange={(e) => setImage(e.target.value)}
      className="input-field"
    />
  </label>
  <label className="form-label">
    Video:
    <input
      type="text"
      value={video}
      onChange={(e) => setVideo(e.target.value)}
      className="input-field"
    />
  </label>
  <button type="submit" className="submit-button">Tạo Bài Viết</button>
</form>

<h2 className="user-posts-title">Bài Viết Của Bạn</h2>
<ul className="posts-list">
  {userPosts.map((post) => (
    <li key={post._id} className="post-item">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content.slice(0, 100)}...</p>
      <div className="status">
        {post.status === "approved" ? (
          <span className="approved-status">Đã duyệt</span>
        ) : (
          <span className="pending-status">Chưa duyệt</span>
        )}
      </div>
    </li>
  ))}
</ul>
    </div>
  );
}

export default AddPostPage;
