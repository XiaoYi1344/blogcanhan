import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // External CSS file for custom styles

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // Assuming role is stored in localStorage
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="homepage-container">
      <header className="hero-section text-center">
        <h1>Welcome to Your Artistic Blog</h1>
        <p>Express your creativity, one post at a time!</p>
      </header>

      <div className="button-section text-center mt-5">
      <button className="btn btn-primary" onClick={() => {
  console.log("Navigating to /add-post");
  navigate("/add-page");
}}>
  ✨ Add New Post
</button>

        <button className="btn btn-secondary" onClick={() => navigate("/posts")}>
          📜 View Posts
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <section className="features-section text-center mt-5">
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="feature-card">
              <h3>🎨 Artistic Layout</h3>
              <p>Design your posts in the most creative ways possible!</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="feature-card">
              <h3>📝 Writing Tools</h3>
              <p>Access all the writing tools you need for your blog posts.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="feature-card">
              <h3>📚 Blog Archive</h3>
              <p>Browse through your old posts anytime with ease.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center mt-5">
        <p>&copy; 2025 My Artistic Blog | Designed with love and creativity.</p>
      </footer>
    </div>
  );
};

export default HomePage;
