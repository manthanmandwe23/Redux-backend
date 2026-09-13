import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ProductDatafromBackend,
  ProductDatafromFrontend,
  GetProductDetails,
  ProductId,
} from "../../interfaces/productInterface";
import { api } from "../../api/axios";
import axios from "axios";

interface ProductState {
  loading: boolean;
  error: string | null;
  product: ProductDatafromBackend[];
}
const productiInitialState: ProductState = {
  loading: false,
  error: null,
  product: [],
};

export const addProduct = createAsyncThunk<
  ProductDatafromBackend,
  ProductDatafromFrontend,
  { rejectValue: string }
>("product/addProduct", async (userData, thunkAPI) => {
  try {
    const userResponse = await api.post("/product/addProduct", userData);
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to add product to cart",
      );
    }
    return thunkAPI.rejectWithValue("add product operation failed");
  }
});

export const getAllProducts = createAsyncThunk<
  ProductDatafromBackend[],
  GetProductDetails,
  { rejectValue: string }
>(
  "product/getAllProducts",
  async (
    {
      page,
      limit,
      sort,
      category,
      minPrice,
      maxPrice,
      search,
    }: GetProductDetails,
    thunkAPI,
  ) => {
    try {
      const userResponse = await api.get("/product/getAllProducts", {
        params: {
          page,
          limit,
          sort,
          category,
          minPrice,
          maxPrice,
          search,
        },
      });
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to fetched products",
        );
      }
      return thunkAPI.rejectWithValue("unable to fetched products");
    }
  },
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async ({ product_id }: ProductId, thunkAPI) => {
    try {
      const userResponse = await api.get(
        `/product/getProductById/${product_id}`,
      );
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to fetched product by id",
        );
      }
      throw thunkAPI.rejectWithValue("failed to fetched product by id");
    }
  },
);
