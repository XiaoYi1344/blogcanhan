import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Điều hướng trang
import "./NonLogin.css"; // Import file CSS để thiết kế giao diện

function NonLogin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook điều hướng trang

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/posts");
                if (!response.ok) {
                    throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            {/* Thanh Navbar */}
            <nav className="navbar">
                <div className="logo">📖 Blog</div>
                <div className="nav-buttons">
                    <button className="btn" onClick={() => navigate("/login")}>Login</button>
                    <button className="btn btn-register" onClick={() => navigate("/register")}>Register</button>
                </div>
            </nav>

            {/* Danh sách bài viết */}
            <div className="content">
                <h1>Danh sách bài viết</h1>
                {loading && <p>Đang tải bài viết...</p>}
                {error && <p className="error">{error}</p>}
                
                {!loading && !error && posts.length > 0 ? (
                    <ul className="post-list">
                        {posts.map((post) => (
                            <li key={post._id} className="post-item">
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                                <p className="author">
                                    <strong>Tác giả:</strong>{" "}
                                    {post.author ? `${post.author.name} (${post.author.email})` : "Không xác định"}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p>Không có bài viết nào.</p>
                )}
            </div>
        </div>
    );
}

export default NonLogin;
