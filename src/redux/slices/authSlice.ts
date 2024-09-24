import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      Cookies.set('Authorization', response.data.token);

      message.success("Signup successful!");
      return response.data;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Signup failed"); 
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      message.success("Login successful!"); 
      Cookies.set('Authorization', response.data.token); 
      return response.data;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed"); 
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('Authorization');

      const response = await axios.post(`${API_URL}/auth/profile`,null, {
        headers: {
          Authorization: token, 
        },
      });
      return response.data;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to fetch profile"); 
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);


export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: { name: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData);
      message.success("Profile updated successfully!");  
      return response.data;
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to update profile");
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
      Cookies.remove('Authorization'); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        message.loading("Signing up...", 0); // Display loading message with no timeout
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        message.destroy(); // Remove loading message
      })
      .addCase(signUp.rejected, (state) => {
        state.loading = false;
        message.destroy(); // Remove loading message
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        message.loading("Logging in...", 0); // Display loading message with no timeout
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        message.destroy(); // Remove loading message
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        message.destroy(); // Remove loading message
      })

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        message.loading("Fetching profile...", 0); // Display loading message with no timeout
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        message.destroy(); // Remove loading message
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        message.destroy(); // Remove loading message
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        message.loading("Updating profile...", 0); // Display loading message with no timeout
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        message.destroy(); // Remove loading message
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loading = false;
        message.destroy(); // Remove loading message
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
