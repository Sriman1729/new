import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // ✅ read flag
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
