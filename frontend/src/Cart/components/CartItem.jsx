import React, { useState } from "react";
import { toast } from "sonner";
import { Remove, Update } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  addItemsToCart,
  removeItemFromCart,
} from "../../features/Cart/cartSlice";
import { useNavigate } from "react-router-dom";
const CartItem = ({ cart, item_headers }) => {
  const [quantity, setQuantity] = useState(cart.quantity);
  const { loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("cart Data", cart);
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
    <>
      <div
        className={`cart_item grid grid-cols-${item_headers} gap-4 items-center text-white bg-zinc-800 p-4 mt-4 border-b-1 border-zinc-500 mb-3`}
      >
        {/* Product Info */}
        <div className="text-start tracking-wider">
          <motion.img
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              opacity: {
                duration: 1,
                ease: "easeInOut",
              },
            }}
            whileHover={{ scale: 1.2 }}
            onClick={() => {
              navigate(`/list/${cart.product}`);
            }}
            src={cart.image}
            alt="Product"
            className="w-[120px] mb-2 h-[120px] object-cover bg-transparent rounded-lg cursor-pointer"
          />
          <div>
            <h3 className="font-semibold">{cart.name}</h3>
            <p>
              Price: <strong>₹{cart.price.toFixed(2)}/-</strong>
            </p>
            <p>
              Quantity: <strong>{cart.quantity}</strong>
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            disabled={quantity <= 1 || loading}
            onClick={() => setQuantity((prev) => prev - 1)}
            className="w-[35px] h-[35px] border-2 border-zinc-700 cursor-pointer text-[18px] hover:border-1 hover:border-zinc-500 rounded-lg bg-zinc-700"
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            className="w-[50px] h-[40px] text-center rounded-md border-2 border-zinc-700 mx-[5px] text-[16px] "
          />
          <button
            disabled={loading}
            onClick={() => {
              if (cart.stock <= quantity) {
                toast.error("Cannot exceed available stock!");
                return;
              }
              setQuantity((prev) => prev + 1);
            }}
            className="w-[35px] h-[35px] border-2 border-zinc-700 cursor-pointer text-[18px] hover:border-1 hover:border-zinc-500 rounded-lg bg-zinc-700"
          >
            +
          </button>
        </div>

        {/* Item Total */}
        <div className="flex items-center text-lg font-semibold">
          {(cart.quantity * cart.price).toFixed(2)} /-
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            disabled={loading || quantity === cart.quantity}
            onClick={handleUpdate}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-800 border-1 border-zinc-700 hover:border hover:border-zinc-600 hover:text-lg hover:font-semibold hover:tracking-wide   text-white rounded-xl text-sm font-medium"
          >
            {loading ? "Updating..." : "Update"}
            <Update style={{ fontSize: "24px" }} />
          </button>
          <button
            onClick={handleRemove}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-700 text-red-400 hover:bg-red-300 hover:border hover:border-red-300 hover:text-lg hover:font-semibold hover:tracking-wide  rounded-xl text-sm font-medium"
          >
            Remove
            <Remove style={{ fontSize: "24px" }} />
          </button>
        </div>
      </div>
    </>
  );
};

export default CartItem;
