import React from "react";
import PageTitle from "../components/PageTitle";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import CartItem from "./components/CartItem";
import Lottie from "lottie-react";
import emptyAnimation from "../assets/animations/empty_Cart.json";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const subTotal = cartItems.reduce(
    (asc, item) => asc + item.price * item.quantity,
    0
  );
  const tax = subTotal * 0.18;
  const navigate = useNavigate();
  const item_headers = ["Product", "Quantity", "Item Total", "Actions"];

  return (
    <>
      <PageTitle title="Your cart page" />
      {cartItems.length === 0 ? (
        <div className="flex flex-col bg-zinc-950 items-center justify-center w-full h-screen px-4">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-[300px] sm:w-[500px] md:w-[700px] h-[300px] md:h-[500px]"
            >
              <Lottie animationData={emptyAnimation} loop={true} />
            </motion.div>
          </AnimatePresence>
          <Button className="p-4 mt-6 bg-zinc-800 text-white rounded-xl text-lg hover:bg-zinc-700 font-semibold">
            <Link to="/products">View Products</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-zinc-950 min-h-screen w-full flex justify-center pt-28 pb-10 px-4">
          <div className="flex flex-col xl:flex-row gap-7 items-start max-w-[1500px] w-full">
            {/* ===== Left side (Cart Items) ===== */}
            <div className="flex-1 min-h-[auto] bg-zinc-900 rounded-2xl shadow-lg p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl text-white pb-2 border-b border-zinc-500">
                Your Cart
              </h1>

              {/* Header row - Hidden on small screens */}
              <div className="hidden md:grid bg-zinc-800 text-sm sm:text-base text-white p-4 grid-cols-4 gap-4 mt-5 rounded-2xl mb-3">
                {item_headers.map((item, i) => (
                  <div key={i} className="font-semibold">
                    {item}
                  </div>
                ))}
              </div>

              {/* Cart Items */}
              {cartItems &&
                cartItems.map((cart) => (
                  <CartItem
                    cart={cart}
                    item_headers={item_headers.length}
                    key={cart.name}
                  />
                ))}
            </div>

            {/* ===== Right side (Summary) ===== */}
            <div className="w-full sm:w-[400px] xl:w-[300px] min-h-[auto] bg-zinc-900 rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl text-white pb-2 border-b border-zinc-500">
                Price Summary
              </h3>
              <div className="border-b mt-4 pb-4 border-zinc-500">
                <ul>
                  {[
                    { label: "Subtotal", value: subTotal.toFixed(2) },
                    { label: "Tax (18%)", value: tax },
                    {
                      label: "Shipping",
                      value: subTotal > 500 ? "Free" : 500,
                    },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="mb-3 text-white flex justify-between"
                    >
                      <span>{item.label}:</span>
                      <span>
                        {item.value}{" "}
                        {item.value === "Free" ? "" : <strong>/-</strong>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-white font-semibold text-lg sm:text-xl flex justify-between mt-3">
                <span>Total :</span>
                <span>
                  {(subTotal + tax + (subTotal > 500 ? 0 : 500)).toFixed(2)}{" "}
                  <strong>/-</strong>
                </span>
              </div>

              <Button
                className="text-md mt-10 py-4 sm:py-5 w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"
                onClick={() => navigate("/shipping")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
