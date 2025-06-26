import React from "react";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return element;
};

export default ProtectedRoute;
