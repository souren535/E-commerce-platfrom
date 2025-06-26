import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./components/ProductDetails";
import Products from "./pages/Products";
import Auth from "./Users/Auth";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import { loadUser } from "./features/User/userSlice";
import Profile from "./Users/Profile";
import ProtectedRoute from "./Security/ProtectedRoute";
import UpdateProfile from "./Users/updateProfile";
import ResetPassword from "./Users/ResetPassword";
import CartPage from "./Cart/CartPage";
import ShippingPage from "./features/shipping_page/ShippingPage";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);
  console.log(isAuthenticated, user);
  return (
    <Router>
      {isAuthenticated && <Navbar user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/list/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route
          path="/cart"
          element={<ProtectedRoute element={<CartPage />} />}
        />
        <Route
          path="/shipping"
          element={<ProtectedRoute element={<ShippingPage />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/profile/update"
          element={<ProtectedRoute element={<UpdateProfile />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
