import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
  },
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
export default store;
