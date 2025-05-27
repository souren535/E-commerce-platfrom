import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// get allProduct
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword }, { rejectWithValue }) => {
    try {
      const link = keyword
        ? `/api/product/list?keyword=${keyword}`
        : `/api/product/list`;
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

// // get product suggestions
// export const getProductSuggestion = createAsyncThunk(
//   "product/getProductSuggestion",
//   async ({ keyword }, { rejectWithValue }) => {
//     if (!keyword?.trim()) {
//       return {
//         suggestions: [],
//         message: "No keyword provided",
//       };
//     }
//     try {
//       const link = `/api/product/suggestions?keyword=${keyword}`;
//       const { data } = await axios.get(link);
//       return data;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message ||
//           "An error occurred while fetching product suggestions",
//       });
//     }
//   }
// );

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
    // ProductSuggestions: [],
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    // clearSuggestions: (state) => {
    //   state.ProductSuggestions = [];
    // },
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

    // builder
    //   .addCase(getProductSuggestion.pending, (state) => {
    //     (state.loading = true), (state.error = null);
    //   })
    //   .addCase(getProductSuggestion.fulfilled, (state, action) => {
    //     console.log("Fuillfilled action payload", action.payload);
    //     state.loading = false;
    //     state.error = null;
    //     state.ProductSuggestions = action.payload.suggestions;
    //   })
    //   .addCase(getProductSuggestion.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload || { message: "Something went wrong" };
    //   });
  },
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;
