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
import OrderConfirmPage from "./Cart/orderConfirmPage";
import Payment from "./Cart/Payment";
import Footer from "./components/Footer";
import MyOrders from "./Orders/MyOrders";
import OrderDetails from "./Orders/OrderDetails";
import ProtectedPaymentSuccess from "./Cart/paymentSuccess";
import Unauthorized from "./Security/unauthorized/Unauthorized";
import ProtectedAdminDashboard from "./Admin/AdminDashboard";
import ProtectedOrderConfirmPage from "./Cart/orderConfirmPage";
import ProtectedPayment from "./Cart/Payment";
import ProtectedAdminDashboardProductList from "./Admin/productList";
import ProtectedAdminProductUpdate from "./Admin/productUpdate";
import ProtectedAdminProductCreate from "./Admin/ProductCreate";
import ProtectedAllUsers from "./Admin/AllUsers";
import ProtectedAllOrders from "./Admin/AllOrders";
import ProtectedAllReviews from "./Admin/AllReviews";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ProtectedEditUser from "./Admin/components/editUser";
import ProtectedOrderEdit from "./Admin/components/editOrder";

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
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/list/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminDashboard />} />
        <Route
          path="/admin/order/edit/:orderId"
          element={<ProtectedOrderEdit />}
        />
        <Route
          path="/admin/products"
          element={<ProtectedAdminDashboardProductList />}
        />
        <Route
          path="/admin/products/create"
          element={<ProtectedAdminProductCreate />}
        />
        <Route
          path="/admin/products/edit/:id"
          element={<ProtectedAdminProductUpdate />}
        />
        <Route path="/admin/allUsers" element={<ProtectedAllUsers />} />
        <Route
          path="/admin/user/edit/:userId"
          element={<ProtectedEditUser />}
        />
        <Route path="/admin/allReviews" element={<ProtectedAllReviews />} />
        <Route path="/admin/allOrders" element={<ProtectedAllOrders />} />
        <Route path="/paymentSuccess" element={<ProtectedPaymentSuccess />} />
        <Route path="/order/confirm" element={<ProtectedOrderConfirmPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/process/payment" element={<ProtectedPayment />} />
        <Route
          path="/orders/user"
          element={<ProtectedRoute element={<MyOrders />} />}
        />
        <Route
          path="/order/:id"
          element={<ProtectedRoute element={<OrderDetails />} />}
        />
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
      <Footer />
    </Router>
  );
};

export default App;
