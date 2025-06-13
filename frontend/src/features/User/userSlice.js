import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Signup api call

export const signup = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      let link = "/api/user/add";
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(link, userData, config);
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

// load user api call

export const loadUser = createAsyncThunk(
  "user/loaduser",
  async (_, { rejectWithValue }) => {
    try {
      const link = "/api/user/profile";
      const { data } = await axios.post(link, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to load user. Please try again later.",
        }
      );
    }
  }
);

// logout api call

export const logOut = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const link = "/api/user/logout";
      const { data } = await axios.post(link, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Logout faild. lease try again later. ",
        }
      );
    }
  }
);

//  update profile api call

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const link = "/api/user/profile/update";
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.put(link, userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "profile update failed, please try again later",
        }
      );
    }
  }
);

// update password api call

export const updatePassword = createAsyncThunk(
  "user/passwordUpdate",
  async (passwordData, { rejectWithValue }) => {
    try {
      const link = "/api/user/password/update";
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(link, passwordData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update Password failed.");
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
    message: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    resetUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(signup.fulfilled, (state, action) => {
        (state.loading = false), (state.error = null);
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
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
        (state.loading = false), (state.error = null);
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Login Failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(loadUser.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        (state.loading = false), (state.error = null);
        state.success = action.payload.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Login Failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(logOut.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(logOut.fulfilled, (state) => {
        (state.loading = false), (state.error = null);
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Logout Failed. Please try again later.";
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        (state.loading = false), (state.error = null);
        state.user = action.payload?.user || null;
        state.success = action.payload?.success;
        state.message = action.payload?.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          " Profile update failed. Please try again later.";
      });

    builder
      .addCase(updatePassword.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        (state.loading = false), (state.success = action.payload?.success);
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          "Update Password failed. Please try again later.";
      });
  },
});

export const { removeErrors, removeSuccess, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;
