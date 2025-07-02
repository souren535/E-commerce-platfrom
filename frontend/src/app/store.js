import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import userReducer from "../features/User/userSlice";
import cartReducer from "../features/Cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import adminReducer from "../features/Admin/adminSlice";
export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});
