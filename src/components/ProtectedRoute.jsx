// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("admin-auth"); // flag for login
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
