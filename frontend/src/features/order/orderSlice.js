import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post("/api/order/create", order, config);
      console.log("create orders", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "Order creating failed");
    }
  }
);

export const getAllOrder = createAsyncThunk(
  "order/getAllOredr",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/order/orders/user");
      console.log("get all orders", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "Fetch to failed orders");
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/orderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/order/orderDetail/${id}`, {
        withCredentials: true,
      });
      console.log("✅ Data from API:", data);
      return data;
    } catch (error) {
      console.log("❌ Error fetching order details", error.response?.data);
      return rejectWithValue(error.response?.data || "Fetch to failed details");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    success: false,
    message: null,
    order: {},
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = false),
          (state.success = action.payload.success);
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload?.message || "Order creating failed");
      });

    builder
      .addCase(getAllOrder.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getAllOrder.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = false),
          (state.success = action.payload.success);
        state.message = action.payload.message;
        state.orders = action.payload.orders;
      })
      .addCase(getAllOrder.rejected, (state, action) => {
        (state.loading = false), (state.message = action.payload.message);
        state.error = action.payload?.message || "Fetch to failed orders";
      });

    builder
      .addCase(getOrderDetails.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        console.log("API Payload", action.payload);
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order; // ✅ IMPORTANT!
      })

      .addCase(getOrderDetails.rejected, (state, action) => {
        console.log("Error Payload", action.payload);
        state.loading = false;
        state.error = action.payload; // ✅ direct value
      });
  },
});

export const { removeError, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;
