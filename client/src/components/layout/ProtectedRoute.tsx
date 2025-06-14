// src/components/layout/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: roles allowed to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // Get user role from local storage

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/sign-in" replace />;
  }

  // If roles are defined and user's role is not allowed, redirect
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // You might want a specific unauthorized page or just redirect to home
    // For now, let's redirect to the main dashboard if unauthorized
    return <Navigate to="/" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
