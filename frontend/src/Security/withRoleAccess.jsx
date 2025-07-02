// Security/withRoleAccess.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const withRoleAccess = (WrappedComponent) => {
  return (props) => {
    const { user, loading } = useSelector((state) => state.user); // Assuming both are in state.user
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          navigate("/auth");
        } else if (user.role !== "admin") {
          navigate("/unauthorized");
        }
      }
    }, [user, loading, navigate]);

    // Still loading? Show Loader
    if (loading || !user) {
      return <Loader />;
    }

    // Authorized? Render component
    if (user.role === "admin") {
      return <WrappedComponent {...props} />;
    }

    // No need to return anything if already redirected
    return null;
  };
};

export default withRoleAccess;
