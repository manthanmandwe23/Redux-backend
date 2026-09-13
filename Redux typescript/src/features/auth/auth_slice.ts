import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import axios from "axios";
import {
  User,
  RegisterUser,
  loginUserfromFrontend,
  GetCurUser,
} from "../../interfaces/userInterface";

interface UserState {
  loading: boolean;
  error: string | null;
  user: RegisterUser | GetCurUser | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,
};

// here why we use axios.isAxiosError(error)
// if we directly try to do
// catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data.message);
// }
// it will give error:
// error' is of type 'unknown'.ts(18046)
// (local var) error: unknown
// here= error.response.data.message
// and why error because TypeScript's catch variable is unknown by default.

// therefore we used axios.isAxiosError(error) It tells TypeScript that error is an Axios error, so error.response becomes accessible.

//User → what the thunk returns
// RegisterUserData → what you pass INTO the thunk

export const registerUser = createAsyncThunk<
  RegisterUser,
  User,
  { rejectValue: string }
>("user/registerUser", async (userData, thunkAPI) => {
  try {
    const userResponse = await api.post("/user/register", userData);
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
    return thunkAPI.rejectWithValue("something went wrong");
  }
});

export const loginUser = createAsyncThunk<
  RegisterUser,
  loginUserfromFrontend,
  { rejectValue: string }
>("user/login", async (userData, thunkAPI) => {
  try {
    const userResponse = await api.post("/user/login", userData);
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login Failed",
      );
    }
    return thunkAPI.rejectWithValue("user login failed");
  }
});

export const logoutUser = createAsyncThunk<{}, void, { rejectValue: string }>(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const userResponse = await api.post("/user/logout");
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "logout failed",
        );
      }
      return thunkAPI.rejectWithValue("unable to logout user");
    }
  },
);

export const getcurrUser = createAsyncThunk<
  GetCurUser,
  void,
  { rejectValue: string }
>("user/getcurruser", async (_, thunkAPI) => {
  try {
    const userResponse = await api.get("user/getcurruser");
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "unable to fetch user",
      );
    }
    return thunkAPI.rejectWithValue("user fetching failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //RegisterUser
      .addCase(registerUser.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.user = action.payload),
          (state.isAuthenticated = true));
      })
      .addCase(registerUser.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload as string));
      })
      //Login USER
      .addCase(loginUser.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.user = action.payload),
          (state.isAuthenticated = true));
      })
      .addCase(loginUser.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload as string));
      })
      //logout user
      .addCase(logoutUser.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.user = null),
          (state.isAuthenticated = false));
      })
      .addCase(logoutUser.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload as string));
      })
      // getcurrUser
      .addCase(getcurrUser.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getcurrUser.fulfilled, (state, action) => {
        ((state.loading = false),
          (state.user = action.payload),
          (state.isAuthenticated = true));
      })
      .addCase(getcurrUser.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload as string));
      });
  },
});

export default userSlice.reducer;
