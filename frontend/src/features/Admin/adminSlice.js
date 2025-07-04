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
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;

export default adminSlice.reducer;
