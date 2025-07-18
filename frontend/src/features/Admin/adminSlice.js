import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.put(
        `/api/product/admin/update/${id}`,
        productData,
        config
      );
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

//  softdelete admin product
export const deleteAdminProduct = createAsyncThunk(
  "admin/deleteAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/product/admin/delete/${id}`);
      console.log(data);
      return { id };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while fetching products",
      });
    }
  }
);

//  permanant delete

export const parmanentDeleteAdminProduct = createAsyncThunk(
  "admin/parmanentDeleteAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/product/admin/parmanentDelete/${id}`
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while deleting product",
      });
    }
  }
);

// fetch soft deleted product
export const getAdminSoftDeleted = createAsyncThunk(
  "admin/getAdminSoftDeleted",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/product/admin/getSoftDeleted/");
      console.log(data);
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

// restore delete product

export const restoreDeletedProduct = createAsyncThunk(
  "admin/restoreDeletedProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/product/admin/restore/${id}`);
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

// create product
export const productCreate = createAsyncThunk(
  "admin/productCreate",
  async (productData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        "/api/product/admin/create",
        productData,
        config
      );
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while creating product",
      });
    }
  }
);

//  fetch all user data

export const fetchAllUser = createAsyncThunk(
  "admin/fetchAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/user/admin/allUsers");
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to fetch user data",
      });
    }
  }
);

// get gingle user

export const AdminGetSingleUser = createAsyncThunk(
  "admin/AdminGetSingleUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/user/admin/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to fetch user data",
      });
    }
  }
);

// delete user

export const AdminDeleteUser = createAsyncThunk(
  "admin/AdminDeleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/user/admin/user/delete/${userId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to fetch user data",
      });
    }
  }
);

// update role
export const updateUserRoll = createAsyncThunk(
  "admin/updateUserRoll",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/user/admin/user/update/${userId}`,
        { role }
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to update role",
      });
    }
  }
);

// fetch oredr api
export const getAllOrders = createAsyncThunk(
  "admin/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/order/getAll/adminOrders");

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to update role",
      });
    }
  }
);

// fetch order details api
export const getAdminOrderDetails = createAsyncThunk(
  "admin/getAdminAdminOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/order/admin/OrderDetails/${orderId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to fetch order detail",
      });
    }
  }
);

// update order status
export const AdminUpdateOrderStatus = createAsyncThunk(
  "admin/AdminUpdateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/order/adminUpdate/orderStatus/${orderId}`,
        { status },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to fetch order detail",
      });
    }
  }
);

//  delete order
export const AdminDeleteOrder = createAsyncThunk(
  "admin/AdminDeleteOrder",
  async (oredrId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/order/admin/deleteOrder/${oredrId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to delete order",
      });
    }
  }
);

// fetch all reviews
export const fetchAllReviews = createAsyncThunk(
  "admin/fetchAllReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/product/admin/getall/reviews?productId=${productId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to fetch all reviews",
      });
    }
  }
);

// fetch all reviews
export const adminDeleteReviews = createAsyncThunk(
  "admin/adminDeleteReviews",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/product/admin/delete/reviews?productId=${productId}&id=${reviewId}`
      );
      console.log("Deleted review:", data);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "faild to delete reviews",
      });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    products: [],
    success: {
      create: false,
      update: false,
      fetch: false,
      delete: false,
    },
    error: null,
    product: {},
    deleteLoading: false,
    softDeleted: [],
    deleting: {},
    users: [],
    user: {},
    message: null,
    orders: [],
    order: {},
    totalAmount: null,
    reviews: [],
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state, action) => {
      if (action.payload && state.success[action.payload]) {
        state.success[action.payload] = false;
      } else {
        state.success = {
          create: false,
          update: false,
          fetch: false,
          delete: false,
        };
      }
    },
    clearMessage: (state) => {
      state.message = null;
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
        state.success.fetch = action.payload?.success;
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
        state.success.update = action.payload?.success;
        state.product = action.payload.updateProduct;
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
        state.success.create = action.payload.success;
        state.products.push(action.payload.product);
      })
      .addCase(productCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    builder
      .addCase(deleteAdminProduct.pending, (state) => {
        state.deleteLoading = true;
        state.error = false;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success.delete = action.payload.success;
        state.products = state.products.filter(
          (product) => product._id !== action.payload.id
        );
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    builder
      .addCase(getAdminSoftDeleted.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(getAdminSoftDeleted.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.softDeleted = action.payload.products;
      })
      .addCase(getAdminSoftDeleted.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    builder
      .addCase(restoreDeletedProduct.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(restoreDeletedProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.success.fetch = action.payload.success;

        // Add restored product back to products
        state.products.push(action.payload.product);
        // Remove restored product from recycle bin
        state.softDeleted = state.softDeleted.filter(
          (p) => p._id !== action.payload.product._id
        );
      })
      .addCase(restoreDeletedProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    builder
      .addCase(parmanentDeleteAdminProduct.pending, (state, action) => {
        const id = action.meta.arg;
        state.deleting[id] = true;
      })
      .addCase(parmanentDeleteAdminProduct.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.deleting[id] = false;
        state.success.delete = action.payload.success;
        const deletedProductId = action.payload?.product?._id || id;

        state.softDeleted = state.softDeleted.filter(
          (p) => p._id !== deletedProductId
        );
      })
      .addCase(parmanentDeleteAdminProduct.rejected, (state, action) => {
        const id = action.meta.arg;
        state.deleting[id] = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // users details reducers

    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to fetch user data";
      });

    builder
      .addCase(AdminGetSingleUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(AdminGetSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(AdminGetSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to fetch user data";
      });

    builder
      .addCase(updateUserRoll.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateUserRoll.fulfilled, (state, action) => {
        state.loading = false;
        state.success.update = action.payload.success;
      })
      .addCase(updateUserRoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to fetch user data";
      });

    builder
      .addCase(AdminDeleteUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(AdminDeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success.update = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(AdminDeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to delete user ";
      });

    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success.update = action.payload.success;
        state.orders = action.payload.orders;
        state.message = action.payload.message;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to orders data ";
      });

    builder
      .addCase(getAdminOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAdminOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success.fetch = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(getAdminOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to orders data ";
      });

    builder
      .addCase(AdminUpdateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(AdminUpdateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success.update = action.payload.success;
        state.order = action.payload.order;
      })
      .addCase(AdminUpdateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to update status ";
      });

    builder
      .addCase(AdminDeleteOrder.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(AdminDeleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success.update = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(AdminDeleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to delete order ";
      });

    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.success.update = action.payload.success;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to fetch all reviews ";
      });

    builder
      .addCase(adminDeleteReviews.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(adminDeleteReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.success.delete = action.payload.success;
        state.reviews = action.payload.reviews;
        state.message = action.payload.message;
      })
      .addCase(adminDeleteReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "faild to delete reviews ";
      });
  },
});

export const { removeErrors, removeSuccess, clearMessage } = adminSlice.actions;

export default adminSlice.reducer;
