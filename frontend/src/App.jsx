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
import WithLayout from "./components/HOC/WithLayout";

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
      <Routes>
        <Route path="/" element={React.createElement(WithLayout(Home))} />
        <Route path="/aboutUs" element={React.createElement(WithLayout(AboutUs))} />
        <Route path="/contactUs" element={React.createElement(WithLayout(ContactUs))} />
        <Route path="/products" element={React.createElement(WithLayout(Products))} />
        <Route path="/list/:id" element={React.createElement(WithLayout(ProductDetails))} />
        <Route path="/products/:keyword" element={React.createElement(WithLayout(Products))} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/admin/dashboard" element={React.createElement(WithLayout(ProtectedAdminDashboard))} />
        <Route
          path="/admin/order/edit/:orderId"
          element={React.createElement(WithLayout(ProtectedOrderEdit))}
        />
        <Route
          path="/admin/products"
          element={React.createElement(WithLayout(ProtectedAdminDashboardProductList))}
        />
        <Route
          path="/admin/products/:keyword"
          element={React.createElement(WithLayout(ProtectedAdminDashboardProductList))}
        />
        <Route
          path="/admin/products/create"
          element={React.createElement(WithLayout(ProtectedAdminProductCreate))}
        />
        <Route
          path="/admin/products/edit/:id"
          element={React.createElement(WithLayout(ProtectedAdminProductUpdate))}
        />
        <Route path="/admin/allUsers" element={React.createElement(WithLayout(ProtectedAllUsers))} />
        <Route
          path="/admin/user/edit/:userId"
          element={React.createElement(WithLayout(ProtectedEditUser))}
        />
        <Route path="/admin/allReviews" element={React.createElement(WithLayout(ProtectedAllReviews))} />
        <Route path="/admin/allOrders" element={React.createElement(WithLayout(ProtectedAllOrders))} />
        <Route path="/paymentSuccess" element={React.createElement(WithLayout(ProtectedPaymentSuccess))} />
        <Route path="/order/confirm" element={React.createElement(WithLayout(ProtectedOrderConfirmPage))} />
        <Route path="/unauthorized" element={React.createElement(WithLayout(Unauthorized))} />
        <Route path="/process/payment" element={React.createElement(WithLayout(ProtectedPayment))} />
        <Route
          path="/orders/user"
          element={React.createElement(WithLayout(() => <ProtectedRoute element={<MyOrders />} />))}
        />
        <Route
          path="/order/:id"
          element={React.createElement(WithLayout(() => <ProtectedRoute element={<OrderDetails />} />))}
        />
        <Route
          path="/cart"
          element={React.createElement(WithLayout(() => <ProtectedRoute element={<CartPage />} />))}
        />
        <Route
          path="/shipping"
          element={React.createElement(WithLayout(() => <ProtectedRoute element={<ShippingPage />} />))}
        />
        <Route
          path="/profile"
          element={React.createElement(WithLayout(() => <ProtectedRoute element={<Profile />} />))}
        />
        <Route
          path="/profile/update"
          element={React.createElement(WithLayout(() => <ProtectedRoute element={<UpdateProfile />} />))}
        />
      </Routes>
    </Router>
  );
};

export default App;
