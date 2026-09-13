import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import axios from "axios";
import {
  CartData,
  AddToCartData,
  ProductIdData,
} from "../../interfaces/cartInterface";

interface CartState {
  loading: boolean;
  error: null | string;
  cart: CartData[];
}

const initialState: CartState = {
  loading: false,
  error: null,
  cart: [],
};

export const addtocart = createAsyncThunk<
  CartData,
  AddToCartData,
  { rejectValue: string }
>(
  "cart/addtocart",
  async ({ product_id, quantity }: AddToCartData, thunkAPI) => {
    try {
      const userResponse = await api.post(`/cart/addToCart/${product_id}`, {
        quantity,
      });
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to add to cart",
        );
      }
      return thunkAPI.rejectWithValue("add to cart failed");
    }
  },
);

export const getcart = createAsyncThunk<
  CartData[],
  void,
  { rejectValue: string }
>("cart/getcart", async (_, thunkAPI) => {
  try {
    const userResponse = await api.get("/cart/getCart");
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to get cart details",
      );
    }
    return thunkAPI.rejectWithValue("failed to fetched cart details");
  }
});

export const updateCartItem = createAsyncThunk<
  CartData,
  AddToCartData,
  { rejectValue: string }
>(
  "cart/updateCartItem",
  async ({ product_id, quantity }: AddToCartData, thunkAPI) => {
    try {
      const userResponse = await api.patch(
        `/cart/updateCartItem/${product_id}`,
        {
          quantity,
        },
      );
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to update cart",
        );
      }
      return thunkAPI.rejectWithValue("update cart operation failed");
    }
  },
);

export const removeFromCart = createAsyncThunk<
  {},
  ProductIdData,
  { rejectValue: string }
>("cart/removeFromCart", async ({ product_id }: ProductIdData, thunkAPI) => {
  try {
    const userResponse = await api.delete(`/cart/removeFromCart/${product_id}`);
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to remove from cart",
      );
    }
    return thunkAPI.rejectWithValue("remove cart operation failed");
  }
});

export const clearCart = createAsyncThunk<{}, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const userResponse = await api.delete("/cart/clearCart");
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to clear cart",
        );
      }
      return thunkAPI.rejectWithValue("clear cart opertaion failed");
    }
  },
);

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addtocart.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      //state.cart.push(action.payload) why we use push because cart is an array of products
      .addCase(addtocart.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.cart.findIndex(
          (item) => item.product_id === action.payload.product_id,
        );

        if (index !== -1) {
          state.cart[index] = action.payload;
        } else {
          state.cart.push(action.payload);
        }
      })
      .addCase(addtocart.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to add to cart"));
      })
      //getCart
      .addCase(getcart.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getcart.fulfilled, (state, action) => {
        ((state.loading = false), (state.cart = action.payload));
      })
      .addCase(getcart.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to get cart details"));
      })
      //updateCartItem
      .addCase(updateCartItem.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      //description is in onenote updateCartItem.fulfilled
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.cart.findIndex(
          (item) => item.product_id === action.payload.product_id,
        );

        if (index !== -1) {
          state.cart[index] = action.payload;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to update cart"));
      })
      //removeFromCart
      .addCase(removeFromCart.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = state.cart.filter(
          (item) => item.product_id !== action.meta.arg.product_id,
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to remove from cart"));
      })
      //clearCart
      .addCase(clearCart.pending, (state, action) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        ((state.loading = false), (state.cart = []));
      })
      .addCase(clearCart.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to clear cart "));
      });
  },
});

export default cartSlice;
