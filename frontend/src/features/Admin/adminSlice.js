import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AwardIcon } from "lucide-react";

export const getAdminProducts = createAsyncThunk(
  "admin/getAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/product/admin/list");
      if (!data || typeof data !== "object") {
        return rejectWithValue({ message: "Invalid response from server" });
      }
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while fetching products",
      });
    }
  }
);

//  update admin product
export const updateAdminProduct = createAsyncThunk(
  "admin/updateAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("/api/product/admin/update/:id");
      console.log(data);
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

// create product

export const productCreate = createAsyncThunk(
  "admin/productCreate",
  async ({ productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/product/admin/create", {
        productData,
      });
      console.log(data);
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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    products: [],
    success: false,
    error: null,
    product: {},
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = action.payload?.success;
        state.products = action.payload?.products;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    builder
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = action.payload?.success;
        state.product = action.payload?.product;
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    builder
      .addCase(productCreate.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(productCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = action.payload?.success;
        state.product = action.payload?.product;
      })
      .addCase(productCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;

export default adminSlice.reducer;
