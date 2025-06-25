import React, { useState } from "react";
import { toast } from "sonner";
import { Remove, Update } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemsToCart,
  removeItemFromCart,
} from "../../features/Cart/cartSlice";
const CartItem = ({ cart, item_headers }) => {
  const [quantity, setQuantity] = useState(cart.quantity);
  const { loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
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
        className={`cart_item grid grid-cols-${item_headers} gap-4 items-center text-white bg-zinc-700 p-4 mt-4 border-b-1 border-white mb-3`}
      >
        {/* Product Info */}
        <div className="text-start tracking-wider">
          <img
            src={cart.image}
            alt="Product"
            className="w-[120px] mb-2 h-[120px] object-cover bg-transparent rounded-lg"
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
            className="w-8 h-8 border border-white bg-white text-black rounded-lg hover:border-zinc-500"
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            className="w-12 h-8 text-center bg-zinc-100 text-black border border-white rounded-lg"
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
            className="w-8 h-8 border border-white bg-white text-black rounded-lg hover:border-zinc-500"
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
            className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-500 hover:bg-zinc-800 hover:border hover:border-white text-white rounded-xl text-sm font-medium"
          >
            {loading ? "Updating" : "Update"}
            <Update style={{ fontSize: "24px" }} />
          </button>
          <button
            onClick={handleRemove}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-400 hover:bg-red-500 hover:border hover:border-white text-white rounded-xl text-sm font-medium"
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
