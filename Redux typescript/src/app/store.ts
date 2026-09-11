import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/auth_slice";
export const store = configureStore({
  reducer: {
    user: authSlice,
  },
});
