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
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
      })

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

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token
        message.success("Profile fetched successfully!"); 
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        message.error("Profile not fetched successfully!"); 
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
        message.success("Profile updated successfully!"); 
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        message.error("Profile not Updated successfully!"); 

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
