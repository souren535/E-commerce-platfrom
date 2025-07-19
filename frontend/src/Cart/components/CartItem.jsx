import React, { useState } from "react";
import { toast } from "sonner";
import { Remove, Update } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemsToCart, removeItemFromCart } from "@/features/Cart/cartSlice";
import { motion } from "framer-motion";

const CartItem = ({ cart }) => {
  const [quantity, setQuantity] = useState(cart.quantity);
  const { loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  motion;
  const handleUpdate = () => {
    if (loading) return;
    if (quantity !== cart.quantity) {
      dispatch(addItemsToCart({ id: cart.product, quantity }));
    }
  };

  const handleRemove = () => {
    if (loading) return;
    dispatch(removeItemFromCart(cart.product));
    toast.success(`${cart.name} removed from cart successfully`);
  };

  return (
    <div
      className={`
        cart_item text-white bg-zinc-900 shadow-lg rounded-2xl mt-4 mb-4 p-4
        grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4
        items-stretch
      `}
    >
      {/* 1. Product */}
      <div className="flex flex-col md:flex-row md:items-center h-full">
        {/* Label for mobile */}
        <span className="text-xs text-zinc-400 font-semibold md:hidden mb-1">
          Product
        </span>
        <motion.img
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={cart.image}
          alt={cart.name}
          className="w-20 h-20 md:w-[60px] md:h-[60px] object-cover rounded-lg cursor-pointer mr-0 md:mr-4"
          onClick={() => navigate(`/list/${cart.product}`)}
        />
        <div className="mt-2 md:mt-0">
          <h3 className="font-semibold text-base md:text-md">{cart.name}</h3>
          <p className="text-sm text-zinc-300">₹{cart.price.toFixed(2)}</p>
        </div>
      </div>

      {/* 2. Quantity */}
      <div className="flex flex-col md:items-center md:justify-center h-full">
        <span className="text-xs text-zinc-400 font-semibold md:hidden mb-1">
          Quantity
        </span>
        <div className="flex items-center gap-3">
          <button
            disabled={quantity <= 1 || loading}
            onClick={() => setQuantity((prev) => prev - 1)}
            className="w-8 h-8 text-lg rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50"
          >
            -
          </button>
          <input
            type="text"
            readOnly
            value={quantity}
            className="w-10 text-center bg-zinc-800 border border-zinc-600 rounded"
          />
          <button
            disabled={loading}
            onClick={() => {
              if (quantity >= cart.stock) {
                toast.error("Cannot exceed stock limit!");
                return;
              }
              setQuantity((prev) => prev + 1);
            }}
            className="w-8 h-8 text-lg rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      {/* 3. Item Total */}
      <div className="flex flex-col md:items-center md:justify-center h-full">
        <span className="text-xs text-zinc-400 font-semibold md:hidden mb-1">
          Item Total
        </span>
        <div className="font-semibold">
          ₹{(cart.price * quantity).toFixed(2)}
        </div>
      </div>

      {/* 4. Actions */}
      <div className="flex flex-col md:items-center md:justify-center gap-2 h-full">
        <span className="text-xs text-zinc-400 font-semibold md:hidden mb-1">
          Actions
        </span>
        <button
          disabled={loading || quantity === cart.quantity}
          onClick={handleUpdate}
          className="bg-zinc-700 hover:bg-zinc-600 rounded px-4 py-2 text-sm flex items-center justify-center gap-1 disabled:opacity-50 w-full md:w-auto"
        >
          Update <Update style={{ fontSize: "16px" }} />
        </button>
        <button
          onClick={handleRemove}
          className="bg-red-600 hover:bg-red-700 rounded px-4 py-2 text-sm text-white flex items-center justify-center gap-1 w-full md:w-auto"
        >
          Remove <Remove style={{ fontSize: "16px" }} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
