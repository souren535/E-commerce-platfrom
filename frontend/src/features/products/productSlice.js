import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// get allProduct
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (_, { rejectWithValue }) => {
    try {
      const link = "/api/product/list";
      const { data } = await axios.post(link);
      return data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while fetching products",
      });
    }
  }
);

// Product Details
export const getProductdetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/product/list/${id}`;
      const { data } = await axios.post(link);
      return data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while fetching product details",
      });
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        console.log("Fuillfilled action payload", action.payload);
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "somthing went wrong";
      });

    builder
      .addCase(getProductdetails.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getProductdetails.fulfilled, (state, action) => {
        console.log("Fuillfilled action payload", action.payload);
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getProductdetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Something went wrong" };
      });
  },
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;
