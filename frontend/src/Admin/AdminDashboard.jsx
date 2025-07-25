import React, { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Globe,
  Instagram,
  LinkedinIcon,
  GithubIcon,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import withRoleAccess from "../Security/withRoleAccess";
import { AttachMoney, ErrorOutline, Inventory } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllReviews,
  getAdminProducts,
  getAllOrders,
} from "../features/Admin/adminSlice";
import { Dashboard } from "@mui/icons-material";

// Sidebar Component
const Sidebar = React.forwardRef(
  ({ setshowSocal, isMobile, showSidebar, setShowSidebar }, ref) => {
    const navItems = [
      {
        label: "Dashboard",
        icon: !isMobile ? <LayoutDashboard /> : <Dashboard />,
        to: "#",
      },
      { label: "All Products", icon: <Package />, to: "/admin/products" },
      {
        label: "Create Product",
        icon: <Package />,
        to: "/admin/products/create",
      },
      { label: "All Users", icon: <Users />, to: "/admin/allUsers" },
      { label: "All Orders", icon: <ShoppingCart />, to: "/admin/allOrders" },
      { label: "All Reviews", icon: <Star />, to: "/admin/allReviews" },
      { label: "Social Media", icon: <Globe />, to: "#", isToggle: true },
    ];

    // Hide sidebar on mobile if not toggled
    if (isMobile && !showSidebar) return null;

    return (
      <aside
        ref={ref}
        className="fixed lg:static z-30 w-4/5 max-w-xs lg:w-64 min-h-screen bg-zinc-900/60 text-white backdrop-blur-md border-r border-indigo-800 px-4 sm:px-6 pt-8 pb-10 shadow-2xl top-0 left-0 transition-transform duration-300 lg:mt-20 mt-0 overflow-y-auto"
        style={{
          transform:
            isMobile && !showSidebar ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-2xl font-bold text-indigo-400 tracking-widest uppercase">
            Admin
          </h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-white text-2xl"
          >
            &times;
          </button>
        </div>
        <h2 className="hidden lg:block text-3xl font-bold text-center text-indigo-400 tracking-widest uppercase mb-10">
          Admin
        </h2>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <div
              className="flex items-center gap-4 text-base px-3 sm:px-5 py-3 rounded-xl hover:bg-indigo-800/30 transition-all duration-300 hover:translate-y-1 font-medium hover:text-indigo-300 group"
              key={item.label}
            >
              {item.isToggle ? (
                <Button
                  className="text-indigo-300 group-hover:scale-110 transition cursor-pointer"
                  onClick={() => setshowSocal((prev) => !prev)}
                >
                  {item.icon}
                </Button>
              ) : (
                <Link
                  to={item.to}
                  className="text-indigo-300 group-hover:scale-110 transition"
                >
                  {item.icon}
                </Link>
              )}
              <Link to={item.to}>{item.label}</Link>
            </div>
          ))}
        </nav>
      </aside>
    );
  }
);

// StatsCard Component
const StatsCard = ({ title, value, color, icon, textColor }) => (
  <div
    className={`bg-gradient-to-b from-zinc-900  to-zinc-800 p-5 flex flex-col sm:p-6 rounded-xl shadow-xl border-l-4 ${color} transform hover:scale-[1.02] transition-all w-full`}
  >
    <div className="flex flex-wrap gap-3 mb-2 ">
      <span className={`${textColor}`}>{icon}</span>
      <h3 className="text-xs sm:text-sm uppercase tracking-widest text-zinc-400 mb-2">
        {title}
      </h3>
    </div>
    <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
  </div>
);

// SocalCard Component
const SocalCard = ({ title, color, icon, bColor }) => (
  <div
    className={`bg-gradient-to-br flex items-center gap-4 from-zinc-900 to-zinc-800 p-5 sm:p-6 rounded-xl shadow-xl border-l-4 ${bColor} transform hover:scale-[1.02] transition-all w-full`}
  >
    <span className={`${color} text-3xl`}>{icon}</span>
    <h3 className="text-lg font-semibold tracking-wide text-white">{title}</h3>
  </div>
);

const AdminDashboard = () => {
  const [showSocal, setshowSocal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const { products, orders, totalAmount } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(fetchAllReviews());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setShowSidebar(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, showSidebar]);

  // Ensure only valid products are processed
  const validProducts = Array.isArray(products)
    ? products.filter((product) => product && typeof product.stock === "number")
    : [];

  const outOfStock = validProducts.filter(
    (product) => product.stock === 0
  ).length;
  const inStock = validProducts.filter((product) => product.stock > 0).length;
  const totalReviews = validProducts.reduce(
    (acc, product) =>
      acc + (Array.isArray(product.reviews) ? product.reviews.length : 0),
    0
  );
  return (
    <div className="flex flex-col lg:flex-row bg-zinc-950 min-h-screen relative">
      {/* Sidebar toggle button for mobile/tablet */}
      {isMobile && !showSidebar && (
        <button
          className="fixed top-20 left-4 z-40 text-purple-400 p-4 shadow-lg flex flex-col items-center lg:hidden"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
      )}
      <Sidebar
        ref={sidebarRef}
        setshowSocal={setshowSocal}
        isMobile={isMobile}
        showSidebar={isMobile ? showSidebar : true}
        setShowSidebar={setShowSidebar}
      />
      <main
        className={`flex-1 flex flex-col px-2 sm:px-4 md:px-6 lg:px-10 py-6 sm:py-8 md:py-10 ${
          isMobile ? "mt-32" : "mt-0"
        } lg:mt-15.5`}
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            Dashboard Overview
          </h1>
        </div>

        {/* Stats Section */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <StatsCard
              icon={<Inventory />}
              title="Total Products"
              value={products.length}
              color="border-blue-500"
              textColor="text-blue-500"
            />
            <StatsCard
              icon={<ShoppingCart />}
              title="Total Orders"
              value={orders.length}
              color="border-green-500"
              textColor="text-green-500"
            />
            <StatsCard
              icon={<Star />}
              title="Total Reviews"
              value={totalReviews}
              color="border-yellow-500"
              textColor="text-yellow-500"
            />
            <StatsCard
              icon={<AttachMoney />}
              title="Total Revenue"
              value={totalAmount}
              color="border-purple-500"
              textColor="text-purple-500"
            />
            <StatsCard
              icon={<CheckCircle />}
              title="In Stock"
              value={inStock}
              color="border-emerald-500"
              textColor="text-emerald-500"
            />
            <StatsCard
              icon={<ErrorOutline />}
              title="Out of Stock"
              value={outOfStock}
              color="border-rose-500"
              textColor="text-rose-500"
            />
          </div>
        </div>

        {/* Spacer to push social cards to bottom */}
        <div className="flex-grow" />

        {/* Social Cards Section */}
        {showSocal && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <SocalCard
                title="Instagram"
                color="text-pink-500"
                icon={<Instagram />}
                bColor="border-pink-600"
              />
              <SocalCard
                title="LinkedIn"
                color="text-blue-500"
                icon={<LinkedinIcon />}
                bColor="border-blue-600"
              />
              <SocalCard
                title="Github"
                color="text-zinc-400"
                icon={<GithubIcon />}
                bColor="border-zinc-600"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const ProtectedAdminDashboard = withRoleAccess(AdminDashboard);

export default ProtectedAdminDashboard;
