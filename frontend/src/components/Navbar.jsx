import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Close,
  Menu,
  PersonAdd,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { getProductSuggestion } from "../features/products/productSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [showSuggestions, setShowSuggestions] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const { ProductSuggestions } = useSelector((state) => state.product);

  // useEffect(() => {
  //   const trimmedQuery = searchQuery.trim();
  //   if (trimmedQuery) {
  //     dispatch(getProductSuggestion({ keyword: trimmedQuery }));
  //   } else {
  //     dispatch({ type: "product/clearSuggestions" }); // Optional: clear suggestions
  //   }
  // }, [dispatch, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/products`);
    }
    // setShowSuggestions(false);
    setSearchQuery(""); // Optional: clear input
  };

  // const handleSelectSuggestion = (suggestion) => {
  //   setSearchQuery(suggestion);
  //   navigate(`/products?keyword=${encodeURIComponent(suggestion)}`);
  //   setShowSuggestions(false);
  // };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "About Us", to: "/about-us" },
    { label: "Contact us", to: "/contact-us" },
  ];

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
                // onFocus={() => setShowSuggestions(true)}
                // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black">
                <Search />
              </button>

              {/* {showSuggestions && ProductSuggestions.length > 0 && (
                <ul className="absolute z-50 bg-white w-full mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                  {ProductSuggestions.map((item) => (
                    <li
                      key={item._id}
                      onMouseDown={() => handleSelectSuggestion(item.name)} // Use onMouseDown instead of onClick
                      className="cursor-pointer px-4 py-2 hover:bg-zinc-200"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )} */}
            </form>
          </div>

          <Link to="#" className="relative inline-block">
            <ShoppingCart className="text-zinc-300 hover:text-black text-3xl" />
            <span className="absolute -top-2 -right-2 bg-zinc-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              6
            </span>
          </Link>

          <Link to="/register">
            <PersonAdd className="text-zinc-300 hover:text-black text-2xl" />
          </Link>
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
                  // onFocus={() => setShowSuggestions(true)}
                  // onBlur={() =>
                  //   setTimeout(() => setShowSuggestions(false), 200)
                  // }
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black">
                  <Search />
                </button>

                {/* {showSuggestions && ProductSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-white w-full mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                    {ProductSuggestions.map((item) => (
                      <li
                        key={item._id}
                        onMouseDown={() => handleSelectSuggestion(item.name)} // Use onMouseDown instead of onClick
                        className="cursor-pointer px-4 py-2 hover:bg-zinc-200"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )} */}
              </form>
            </div>
            <div className="flex gap-4">
              <Link to="#" className="relative inline-block">
                <ShoppingCart className="text-zinc-300 hover:text-black text-3xl" />
                <span className="absolute -top-2 -right-2 bg-zinc-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  6
                </span>
              </Link>
              <Link to="/register">
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
