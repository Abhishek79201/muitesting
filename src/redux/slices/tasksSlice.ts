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

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('Authorization'); 
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: token,
        },
      })
        return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: { title?: string; description?: string; completed?: boolean }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('Authorization'); 

      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: {
          Authorization: token, 
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    { id, taskData }: { id: string; taskData: { title?: string; description?: string; completed?: boolean } },
    { rejectWithValue }
  ) => {
    try {
      const token = Cookies.get('Authorization'); 
      console.log(id, taskData);
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    const token = Cookies.get('Authorization'); 

    try {
      await axios.delete(`${API_URL}/tasks/${id}`,{
        headers: {
          Authorization: token, 
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete task");
    }
  }
);

export const fetchTaskMetrics = createAsyncThunk(
  "tasks/fetchTaskMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('Authorization'); 

      const response = await axios.get(`${API_URL}/tasks/metrics`,{
        headers: {
          Authorization: token, 
        },
      });
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
  },
  extraReducers: (builder) => {
    builder
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
      
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task:any) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchTaskMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        console.log("matrics:",action.payload)
      })
      .addCase(fetchTaskMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tasksSlice.reducer;
