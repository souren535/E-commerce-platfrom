import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// get allProduct
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword, page = 1, category }, { rejectWithValue }) => {
    try {
      let link = "/api/product/list?page=" + page;

      if (category) {
        link += `&category=${encodeURIComponent(category)}`;
      }

      if (keyword) {
        link += `&keyword=${encodeURIComponent(keyword)}`;
      }

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

// get allProductSuggestion
export const getProductSuggestions = createAsyncThunk(
  "product/getProductSuggestions",
  async (keyword, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/product/suggestions?keyword=${keyword}`
      );
      return data.suggestions;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "An error occurred while fetching product suggetions",
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
      const { data } = await axios.get(link);
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

// update reviews

export const createProductReview = createAsyncThunk(
  "product/createProductReview",
  async ({ rating, comment, productId }, { rejectWithValue }) => {
    try {
      const link = "/api/product/review";
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        link,
        { rating, comment, productId },
        config
      );
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
    suggestionLoading: false,
    error: null,
    product: null,
    totalPages: 0,
    resultPerPage: 5,
    suggestions: [],
    reviewSuccess: false,
    reviewLoading: false,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.totalPages = action.payload.totalPages;
        state.resultPerPage = action.payload.resultPerPage;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "somthing went wrong";
        state.products = [];
      });

    builder
      .addCase(getProductSuggestions.pending, (state) => {
        state.suggestionLoading = true;
        state.error = null;
      })
      .addCase(getProductSuggestions.fulfilled, (state, action) => {
        state.suggestionLoading = false;
        state.suggestions = action.payload || [];
      })
      .addCase(getProductSuggestions.rejected, (state, action) => {
        state.suggestionLoading = false;
        state.suggestions = [];
        state.error = action.payload || "Something went wrong";
      });

    builder
      .addCase(getProductdetails.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getProductdetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getProductdetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Something went wrong" };
      });

    builder
      .addCase(createProductReview.pending, (state) => {
        (state.reviewLoading = true), (state.error = null);
      })
      .addCase(createProductReview.fulfilled, (state,action) => {
        state.reviewLoading = false;
        state.reviewSuccess = action.payload.success;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload || { message: "Something went wrong" };
      });
  },
});

export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
