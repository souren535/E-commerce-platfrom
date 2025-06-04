import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Signup api call

export const signup = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      let link = "/api/user/add";
      const { data } = await axios.post(link, userData);
      console.log("Signup data", data);
      return data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Signup Failed. Please try again later.",
      });
    }
  }
);

// Login api call

export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const link = "/api/user/login";
      const { data } = await axios.post(link, userData);
      console.log("Login data", data);
      return data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Login Failed. Please try again later.",
      });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(signup.fulfilled, (state, action) => {
        console.log("Signup fulfilled action payload", action.payload);
        (state.loading = false), (state.error = null);
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        console.log("User after signup", state.user);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Signup Failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(login.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Signup fulfilled action payload", action.payload);
        (state.loading = false), (state.error = null);
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        console.log("User after signup", state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Login Failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;

export default userSlice.reducer;
