import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Close,
  Menu,
  PersonAdd,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/features/User/userSlice";
import { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { removeSuccess } from "../features/User/userSlice";
import { getProductSuggestions } from "../features/products/productSlice";
import { debounce } from "lodash";
import SearchSuggestion from "./SearchSuggestion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const manuref = useRef(null);
  const dropDownRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  console.log("user navbar data", user);
  const { cartItems } = useSelector((state) => state.cart);
  const { suggestions, suggestionLoading } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  const fetchSuggestions = useMemo(() => {
    const debounced = debounce((query) => {
      dispatch(getProductSuggestions(query));
    }, 300);

    return debounced;
  }, [dispatch]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      dispatch(getProductSuggestions(""));
      return;
    }
    fetchSuggestions(searchQuery);
    return () => {
      fetchSuggestions.cancel();
    };
  }, [searchQuery, fetchSuggestions, dispatch]);

  const popupLinks = [
    { lable: "Profile", funcName: userAccount },
    { lable: "Orders", funcName: userOrders },
    {
      lable: cartItems.length > 0 ? `Cart${" "}(${cartItems.length})` : "Cart",
      funcName: cart,
      isCart: cartItems.length > 0 ? true : false,
    },
    { lable: "Logout", funcName: logoutUser },
  ];

  if (user && user.role === "admin") {
    popupLinks.unshift({
      lable: "Admin Profile",
      funcName: userDashboard,
    });
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (manuref.current && !manuref.current.contains(event.target)) {
        setOpen(false);
      }
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  console.log("isAuthenticated in App component", isAuthenticated);
  console.log("navbar use object", user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelectSuggestion = (productId) => {
    navigate(`/list/${productId}`);
    setSearchQuery("");
    setShowDropdown(false);
    setIsMenuOpen(false); // Close mobile menu on selection
  };

  const handleViewAll = () => {
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowDropdown(false);
      setIsMenuOpen(false); // Close mobile menu on view all
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/products`);
    }
    setSearchQuery("");
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "About Us", to: "/aboutUs" },
    { label: "Contact us", to: "/contactUs" },
  ];

  function userAccount() {
    navigate("/profile");
  }

  function userOrders() {
    navigate("/orders/user");
  }

  function logoutUser() {
    dispatch(logOut())
      .unwrap()
      .then(() => {
        toast.success("logout successfull");
        dispatch(removeSuccess());
        navigate("/auth");
      })
      .catch((error) => {
        toast.error(error.message || "Logout Failed");
      });
  }

  function userDashboard() {
    navigate("/admin/dashboard");
  }
  function cart() {
    navigate("/cart");
  }

  return (
    <nav className="bg-zinc-950 w-full px-6 py-3 fixed top-0 z-50">
      <div className="flex flex-wrap justify-between items-center gap-2">
        {/* Logo */}
        <div className="text-zinc-300 text-2xl font-semibold">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            ShopEasy
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6 text-white text-sm items-center">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={`hover:bg-zinc-700 hover:p-2 hover:rounded-md transition-all duration-400 ${
                location.pathname === item.to
                  ? "text-white text-lg font-bold"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Search + Icons (Visible in desktop only) */}
        <div className="hidden md:flex items-center gap-4 w-1/3">
          <div className="relative w-full">
            <form className="relative w-full" onSubmit={handleSubmit}>
              <input
                className={`bg-zinc-900 text-white ${
                  !showDropdown ? "rounded-full" : "rounded-t-lg"
                } w-full px-3 py-2 pr-10 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800`}
                placeholder="Search for products"
                type="text"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800"
              >
                <Search />
              </button>
            </form>
            <div className=" absolute w-full z-50" ref={dropDownRef}>
              <SearchSuggestion
                suggestions={suggestions}
                loading={suggestionLoading}
                open={showDropdown && searchQuery.length > 0}
                searchQuery={searchQuery}
                onSelect={handleSelectSuggestion}
                viewAllHandler={handleViewAll}
              />
            </div>
          </div>

          {isAuthenticated && (
            <Link to="/cart" className="relative inline-block">
              <ShoppingCart className="text-white hover:text-zinc-500 text-3xl" />
              {cartItems.length === 0 ? (
                ""
              ) : (
                <span className="absolute -top-2 -right-2 bg-zinc-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {!isAuthenticated ? (
            <Link to="/auth">
              <PersonAdd className="text-zinc-300 hover:text-black text-2xl" />
            </Link>
          ) : (
            <>
              <div className="relative" ref={manuref}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  <div className="w-14 h-14 border-2 border-zinc-400 rounded-full overflow-hidden shrink-0 ">
                    <img
                      src={
                        user?.avatar.url
                          ? user.avatar?.url
                          : "/images/profile_avatar.png"
                      }
                      alt="profile image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {user?.name && (
                    <span className="text-white uppercase text-sm font-semibold tracking-wide">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </div>

                {/* Pop up manu */}

                {open && (
                  <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setOpen(false)}
                  ></div>
                )}

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className=" absolute top-14 right-0 w-40 py-2 z-50"
                    >
                      {popupLinks.map((item, index) => (
                        <motion.button
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 * index }}
                          whileHover={{ scale: 1.2 }}
                          onClick={item.funcName}
                          key={item.lable}
                          className={`block w-full text-center cursor-pointer px-4 py-2 mt-2 rounded-md text-white bg-zinc-700 hover:bg-zinc-800 text-sm ${
                            item.isCart && "bg-zinc-800"
                          }`}
                        >
                          {item.lable}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? (
              <Close className="text-zinc-300 hover:text-black text-3xl transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="text-zinc-300 hover:text-black text-3xl transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Navigation Slide-in Panel */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-2/3 max-w-xs bg-zinc-900 z-40 transform transition-transform duration-300 ease-in-out shadow-lg ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <button
            onClick={toggleMenu}
            className="text-white text-3xl mb-6 self-end hover:text-black"
          >
            <Close />
          </button>

          {/* ✅ MOVE SEARCH + ICONS TO TOP */}
          <div className="mb-6">
            {/* Profile, User Name for Mobile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 mb-4 relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-12 h-12 border-2 border-zinc-400 rounded-full overflow-hidden shrink-0 focus:outline-none"
                  style={{ padding: 0, background: 'none', border: 'none' }}
                  aria-label="Open profile menu"
                >
                  <img
                    src={user?.avatar.url ? user.avatar?.url : "/images/profile_avatar.png"}
                    alt="profile image"
                    className="object-cover w-full h-full"
                  />
                </button>
                {user?.name && (
                  <span className="text-white uppercase text-base font-semibold tracking-wide">
                    {user.name.split(" ")[0]}
                  </span>
                )}
                {/* Mobile Profile Dropdown */}
                {open && (
                  <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setOpen(false)}
                  ></div>
                )}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-14 w-40 py-2 z-50 bg-transparent rounded-md shadow-lg"
                    >
                      {popupLinks.map((item, index) => (
                        <motion.button
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 * index }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            setOpen(false);
                            item.funcName();
                          }}
                          key={item.lable}
                          className={`block w-full text-center cursor-pointer px-4 py-2 mt-2 rounded-md text-white bg-zinc-700 hover:bg-zinc-800 text-sm ${item.isCart && "bg-zinc-800"}`}
                        >
                          {item.lable}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-4 mb-4">
                <Link to="/auth">
                  <PersonAdd className="text-zinc-300 hover:text-black text-2xl" />
                </Link>
              </div>
            )}
            {/* Divider between profile and cart icon */}
            <hr className="my-2 border-zinc-700" />
            {/* Cart icon always visible on mobile */}
            <div className="flex mb-4">
              <Link to="/cart" className="relative inline-block">
                <ShoppingCart className="text-zinc-300 hover:text-black text-3xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zinc-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
            <form className="relative w-full mb-4" onSubmit={handleSubmit}>
              <input
                className="bg-zinc-300 text-black rounded-full w-full px-3 py-2 pr-10"
                placeholder="Search for products"
                type="text"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black"
              >
                <Search />
              </button>
            </form>
            {/* Mobile Search Suggestions */}
            <div className="relative w-full z-50">
              <SearchSuggestion
                suggestions={suggestions}
                loading={suggestionLoading}
                open={showDropdown && searchQuery.length > 0 && isMenuOpen}
                searchQuery={searchQuery}
                onSelect={handleSelectSuggestion}
                viewAllHandler={handleViewAll}
              />
            </div>
          </div>

          {/* 🔽 Navigation Links BELOW search */}
          <ul
            className={`flex flex-col gap-6 text-white text-lg transition-all duration-300 ${
              showDropdown && searchQuery.length > 0 && isMenuOpen ? "mt-32" : "mt-0"
            }`}
          >
            {navLinks.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`hover:text-black transition-colors duration-300 ${
                    location.pathname === item.to ? "text-white text-3xl font-bold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
