import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface Task {
  id: number;
  title: string;
  description: string;
}

interface Metrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

interface TasksState {
  tasks: Task[];
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  metrics: null,
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('Authorization'); 
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: token, // Add Authorization header
        },
      })
        return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

// Async thunk for creating a task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: { title?: string; description?: string; completed?: boolean }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('Authorization'); 

      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: {
          Authorization: token, // Add Authorization header
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create task");
    }
  }
);

// Async thunk for updating a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, taskData }: { id: number; taskData: { title?: string; description?: string; completed?: boolean } },
    { rejectWithValue }
  ) => {
    try {
      const token = Cookies.get('Authorization'); 
      console.log(id, taskData);
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
        headers: {
          Authorization: token, // Add Authorization header
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number, { rejectWithValue }) => {
    const token = Cookies.get('Authorization'); 

    try {
      await axios.delete(`${API_URL}/tasks/${id}`,{
        headers: {
          Authorization: token, // Add Authorization header
        },
      });
      return id; // Return the ID of the deleted task
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete task");
    }
  }
);

// Async thunk for fetching task metrics
export const fetchTaskMetrics = createAsyncThunk(
  "tasks/fetchTaskMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/metrics`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch task metrics");
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Optional additional reducers
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch task metrics
      .addCase(fetchTaskMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchTaskMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
