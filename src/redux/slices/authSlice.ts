import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd"; // Import Ant Design's message component

interface AuthState {
  token: string | null;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api/auth";

// Async thunk for signup
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      Cookies.set('Authorization', response.data.token); // Store token in cookies

      message.success("Signup successful!"); // Success message
      return response.data; // Return both token and user
    } catch (error: any) {
      message.error(error.response?.data?.message || "Signup failed"); // Error message
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      message.success("Login successful!"); // Success message
      Cookies.set('Authorization', response.data.token); // Store token in cookies
      return response.data; // Return both token and user
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed"); // Error message
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('Authorization'); // Retrieve token from cookies

      const response = await axios.post(`${API_URL}/profile`,null, {
        headers: {
          Authorization: token, // Add Authorization header
        },
      });
      return response.data;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to fetch profile"); // Error message
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);


// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: { name: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, profileData);
      message.success("Profile updated successfully!"); // Success message
      return response.data;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to update profile"); // Error message
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuthState: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove('Authorization'); // Clear the cookie on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
      })

      // Fetch Profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Assuming the API returns user data
        state.token = action.payload.token
        message.success("Profile fetched successfully!"); // Success message
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        message.error("Profile not fetched successfully!"); // Error message
      })

      // Update Profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Assuming the API returns the updated user data
        message.success("Profile updated successfully!"); // Success message
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        message.error("Profile not Updated successfully!"); // Success message

      });
  },
});


export const { setToken, clearAuthState } = authSlice.actions;
export const selectToken = (state: { auth: { token: unknown; }; })=> state.auth.token
export const selectUser = (state: { auth: { user: unknown; }; })=> state.auth.user
export const selectLoading = (state: { auth: {
  [x: string]: any; user: unknown; 
}; })=> state.auth.loading

export default authSlice.reducer;
