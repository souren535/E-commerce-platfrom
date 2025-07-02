import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

// eslint-disable-next-line no-unused-vars
const withAuthProtection = (WrappedComponent) => {
  return (props) => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate("/auth");
      }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
      return <Loader />;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuthProtection;
