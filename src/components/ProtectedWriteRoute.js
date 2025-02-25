import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedWriteRoute = () => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  return user?.role === "writer" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedWriteRoute;
