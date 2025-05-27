import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./components/ProductDetails";
import Products from "./pages/Products";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/list/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />
      </Routes>
    </Router>
  );
};

export default App;
