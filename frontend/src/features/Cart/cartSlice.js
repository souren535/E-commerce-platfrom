import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// add item to cart
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const link = `/api/product/list/${id}`;
      const { data } = await axios.get(link);

      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while fetching products",
      });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItem")) || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.success = null;
    },
    removeItemFromCart: (state, action) => {
      state.removingId = action.payload;
      console.log(state.removingId);
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      localStorage.setItem("cartItem", JSON.stringify(state.cartItems));
      state.removingId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItemsToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addItemsToCart.fulfilled, (state, action) => {
      const item = action.payload;
      const existingItems = state.cartItems.find(
        (i) => i.product === item.product
      );
      if (existingItems) {
        existingItems.quantity = item.quantity;
        state.message = `update ${item.name} quantity in the cart.`;
      } else {
        state.cartItems.push(item);
        state.message = `${item.name} is added to cart successfully`;
        localStorage.setItem("cartItem", JSON.stringify(state.cartItems));
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    });
    builder.addCase(addItemsToCart.rejected, (state, action) => {
      state.loading = true;
      state.error = action.payload?.message || "An error occurred";
    });
  },
});

export const { removeError, removeMessage, removeItemFromCart } =
  cartSlice.actions;

export default cartSlice.reducer;
