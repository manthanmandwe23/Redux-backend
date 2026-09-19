import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  orderDetailsFromBackend,
  OrderDetails,
  OrderID,
  OrderIDStatus,
} from "../../interfaces/orderInterface";
import { api } from "../../api/axios";
import axios from "axios";

interface orderState {
  loading: boolean;
  error: string | null;
  orders: orderDetailsFromBackend[];
  selectedOrder: OrderDetails | null;
}

const initialState: orderState = {
  loading: false,
  error: null,
  orders: [],
  selectedOrder: null,
};

export const createOrder = createAsyncThunk<
  orderDetailsFromBackend,
  void,
  { rejectValue: string }
>("order/createOrder", async (_, thunkAPI) => {
  try {
    const userResponse = await api.post("/orders/createOrder");
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to create order",
      );
    }
    return thunkAPI.rejectWithValue("create order process failed");
  }
});

export const getMyOrders = createAsyncThunk<
  orderDetailsFromBackend[],
  void,
  { rejectValue: string }
>("order/getMyOrders", async (_, thunkAPI) => {
  try {
    const userResponse = await api.get("/orders/getMyOrders");
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to fetch order",
      );
    }
    return thunkAPI.rejectWithValue("unable to fetch order");
  }
});

export const getOrderById = createAsyncThunk<
  OrderDetails,
  OrderID,
  { rejectValue: string }
>("order/getOrderById", async ({ order_id }: OrderID, thunkAPI) => {
  try {
    const userResponse = await api.get(`/orders/getOrderById/${order_id}`);

    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to fetch order by id",
      );
    }

    return thunkAPI.rejectWithValue("unable to fetch order by id");
  }
});

export const updateOrderStatus = createAsyncThunk<
  orderDetailsFromBackend,
  OrderIDStatus,
  { rejectValue: string }
>(
  "order/updateOrderStatus",
  async ({ order_id, status }: OrderIDStatus, thunkAPI) => {
    try {
      const userResponse = await api.patch(
        `/orders/updateOrderStatus/${order_id}`,
        { status },
      );
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to update order by order_id",
        );
      }
      return thunkAPI.rejectWithValue("unable to update order by order_id");
    }
  },
);

export const cancelOrder = createAsyncThunk<
  orderDetailsFromBackend,
  OrderID,
  { rejectValue: string }
>("order/cancelOrder", async ({ order_id }: OrderID, thunkAPI) => {
  try {
    const userResponse = await api.patch(`/orders/cancelOrder/${order_id}`);
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to cancle order",
      );
    }
    return thunkAPI.rejectWithValue("unable to cancle order");
  }
});
export const deleteOrder = createAsyncThunk<
  string,
  OrderID,
  { rejectValue: string }
>("order/deleteOrder", async ({ order_id }, thunkAPI) => {
  try {
    const response = await api.delete(`/orders/deleteOrder/${order_id}`);

    return response.data.data.order_id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to delete order",
      );
    }

    return thunkAPI.rejectWithValue("failed to delete order");
  }
});

const orderSlice = createSlice({
  name: "Orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex((item) => {
          return item.order_id === action.payload.order_id;
        });
        if (index !== -1) {
          state.orders[index] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to create order"));
      })
      //getMyOrders
      .addCase(getMyOrders.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to fetch orders"));
      })
      //getOrderById
      .addCase(getOrderById.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to fetch order by id"));
      })
      //updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex((item) => {
          return item.order_id === action.payload.order_id;
        });
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to update order status"));
      })
      //cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex((item) => {
          return item.order_id === action.payload.order_id;
        });
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to cancle order "));
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;

        state.orders = state.orders.filter(
          (order) => order.order_id !== action.payload,
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "failed to delete order";
      });
  },
});

export default orderSlice.reducer;
