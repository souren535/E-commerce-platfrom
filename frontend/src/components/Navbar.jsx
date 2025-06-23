import React, { useState, useEffect } from "react";
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

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const manuref = useRef(null);

  const popupLinks = [
    {
      lable: "Account",
      funcName: userAccount,
    },
    { lable: "Orders", funcName: userOrders },
    { lable: "Logout", funcName: logoutUser },
  ];

  if (user && user.role === "admin") {
    popupLinks.unshift({
      lable: "Admin Profile",
      funcName: userDashboard,
    });
  }
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // close toggle manu click outside

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (manuref.current && !manuref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log("isAuthenticated in App component", isAuthenticated);
  console.log("navbar use object", user);
  const location = useLocation();
  const navigate = useNavigate();

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
    { label: "About Us", to: "/about-us" },
    { label: "Contact us", to: "/contact-us" },
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

  return (
    <nav className="bg-zinc-500 w-full px-6 py-3 fixed top-0 z-50  shadow-md">
      <div className="flex flex-wrap justify-between items-center gap-2">
        {/* Logo */}
        <div className="text-zinc-300 text-2xl font-semibold">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            ShopEasy
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6 text-white text-lg items-center">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={`hover:text-black transition-colors duration-300 ${
                location.pathname === item.to ? "text-black font-bold" : ""
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
                className="bg-zinc-300 text-black rounded-full w-full px-3 py-2 pr-10"
                placeholder="Search for products"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black">
                <Search />
              </button>
            </form>
          </div>

          {isAuthenticated && (
            <Link to="#" className="relative inline-block">
              <ShoppingCart className="text-zinc-300 hover:text-black text-3xl" />
              <span className="absolute -top-2 -right-2 bg-zinc-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                6
              </span>
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
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <img
                      src={
                        user?.avatar?.url
                          ? user.avatar.url
                          : "/images/profile_avatar.png"
                      }
                      alt="profile image"
                      className="object-cover w-full h-full"
                      // onError={(e) => {
                      //   e.target.onerror = null;
                      //   e.target.src = "/images/profile_avatar.png";
                      // }}
                    />
                  </div>
                  {user?.name && (
                    <span className="text-white text-sm font-semibold tracking-wide">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </div>

                {/* Pop up manu */}

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
                          onClick={item.funcName}
                          key={item.lable}
                          className="block w-full text-center px-4 py-2 mt-2 rounded-md text-white bg-zinc-500 hover:bg-zinc-700 text-sm"
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

      {/* Mobile Navigation Slide-in Panel */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-2/3 max-w-xs bg-zinc-700 z-40 transform transition-transform duration-300 ease-in-out shadow-lg ${
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

          <ul className="flex flex-col gap-6 text-white text-lg mb-6">
            {navLinks.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`hover:text-black transition-colors duration-300 ${
                    location.pathname === item.to ? "text-black font-bold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Search + Icons */}
          <div className="mt-auto">
            <div className="relative w-full mb-4">
              <form className="relative w-full mb-4" onSubmit={handleSubmit}>
                <input
                  className="bg-zinc-300 text-black rounded-full w-full px-3 py-2 pr-10"
                  placeholder="Search for products"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black">
                  <Search />
                </button>
              </form>
            </div>
            <div className="flex gap-4">
              <Link to="#" className="relative inline-block">
                <ShoppingCart className="text-zinc-300 hover:text-black text-3xl" />
                <span className="absolute -top-2 -right-2 bg-zinc-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  6
                </span>
              </Link>
              <Link to="/auth">
                <PersonAdd className="text-zinc-300 hover:text-black text-2xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
