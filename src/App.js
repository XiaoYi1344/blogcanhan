import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"; 
import ManagerUsers from "./components/ManagerUssers"; // Fixed typo
import ManagerPosts from "./components/ManagerPosts";
import ManagerStaff from "./components/ManagerStaff";
import Settings from "./components/Settings";
import AddPost from "./components/AddPostPage";
import AddPage from "./components/AddPost";
import ProtectedWriteRoute from "./components/ProtectedWriteRoute"; // New route for write users
import HomePage from "./components/HomePage"; // Create this component for homepage
import Posts from "./components/Post"; // Posts list component
import NonLogin from "./components/NonLogin";

function App() {
  return (
    <Routes>
      {/* Default Route: Redirect to Login */}
      <Route path="/" element={<Navigate to="/non-login" replace />} />
                <Route path="/non-login" element={<NonLogin />} />

      {/* Login and Register Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin protected routes */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager-users" element={<ManagerUsers />} />
        <Route path="/manager-posts" element={<ManagerPosts />} />
        <Route path="/manager-staff" element={<ManagerStaff />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Write protected routes */}
      <Route element={<ProtectedWriteRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-page" element={<AddPage />} />
        <Route path="/posts" element={<Posts />} />
      </Route>

      {/* Home page with Login and Register buttons */}
      <Route
        path="/"
        element={
          <div className="home-buttons">
            <h1>Welcome to Our Website</h1>
            <button onClick={() => window.location.href = "/login"} className="btn-login">Login</button>
            <button onClick={() => window.location.href = "/register"} className="btn-register">Register</button>
          </div>
        }
      />
      
      {/* Redirect to login page on logout */}
      <Route path="/logout" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
