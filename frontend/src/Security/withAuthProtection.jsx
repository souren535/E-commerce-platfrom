import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "sonner";

const withAuthProtection = (WrappedComponent) => {
  return (props) => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        // Show "Login First" toast only when the user is NOT logging out
        if (location.pathname !== "/auth" && !location.state?.fromLogout) {
          toast.warning("Login First!");
        }

        navigate("/auth", { replace: true });
      }
    }, [loading, isAuthenticated, navigate, location]);

    if (loading) {
      return <Loader />;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuthProtection;
