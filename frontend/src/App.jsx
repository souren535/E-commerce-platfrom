import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./components/ProductDetails";
import Products from "./pages/Products";
import Auth from "./Users/Auth";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import { loadUser } from "./features/User/userSlice";

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  console.log("isAuthenticated in App component", isAuthenticated);
  console.log("navbar use object", user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/list/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
      {isAuthenticated && <Navbar user = {user} />}
    </Router>
  );
};

export default App;
