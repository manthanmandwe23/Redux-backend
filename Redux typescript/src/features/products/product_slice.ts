import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ProductDatafromBackend,
  ProductDatafromFrontend,
  GetProductDetails,
  ProductId,
  UpdateProductData,
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
>(
  "product/addProduct",
  async (
    {
      name,
      description,
      price,
      stock,
      category,
      images,
    }: ProductDatafromFrontend,
    thunkAPI,
  ) => {
    try {
      const formData = new FormData();
      if (name !== undefined) formData.append("name", name);
      if (description !== undefined)
        formData.append("description", description);
      if (price !== undefined) formData.append("price", price.toString());
      if (stock !== undefined) formData.append("stock", stock.toString());
      if (category !== undefined) formData.append("category", category);

      if (images) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const userResponse = await api.post("/product/addProduct", formData);
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "failed to add product to cart",
        );
      }
      return thunkAPI.rejectWithValue("add product operation failed");
    }
  },
);

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

export const getProductById = createAsyncThunk<
  ProductDatafromBackend,
  ProductId,
  { rejectValue: string }
>("product/getProductById", async ({ product_id }: ProductId, thunkAPI) => {
  try {
    const userResponse = await api.get(`/product/getProductById/${product_id}`);
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "failed to fetched product by id",
      );
    }
    return thunkAPI.rejectWithValue("failed to fetched product by id");
  }
});

export const updateProductDetails = createAsyncThunk<
  ProductDatafromBackend,
  UpdateProductData,
  { rejectValue: string }
>(
  "product/updateProductDetails",
  async (
    {
      product_id,
      name,
      description,
      price,
      stock,
      category,
      images,
    }: UpdateProductData,
    thunkAPI,
  ) => {
    try {
      const formdata = new FormData();
      if (name !== undefined) formdata.append("name", name);
      if (description !== undefined)
        formdata.append("description", description);
      if (price !== undefined) formdata.append("price", price.toString());
      if (stock !== undefined) formdata.append("stock", stock.toString());
      if (category !== undefined) formdata.append("category", category);

      if (images) {
        images.forEach((image) => {
          formdata.append("images", image);
        });
      }

      const userResponse = await api.patch(
        `/product/updateProductDetails/${product_id}`,
        formdata,
      );
      return userResponse.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message || "failed to update poduct details",
        );
      }
      return thunkAPI.rejectWithValue("update poduct details failed");
    }
  },
);

export const deleteProduct = createAsyncThunk<
  {},
  ProductId,
  { rejectValue: string }
>("product/deleteProduct", async ({ product_id }: ProductId, thunkAPI) => {
  try {
    const userResponse = await api.delete(
      `/product/deleteProduct/${product_id}`,
    );
    return userResponse.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data.message || "failed to delete poduct",
      );
    }
    return thunkAPI.rejectWithValue("delete poduct details failed");
  }
});

const productSlice = createSlice({
  name: "Product",
  initialState: productiInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //add product
      .addCase(addProduct.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.product.findIndex((item) => {
          item.id === action.payload.id;
        });
        if (index !== -1) {
          state.product[index] = action.payload;
        } else {
          state.product.push(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to add product"));
      })
      //getAllProducts
      .addCase(getAllProducts.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        ((state.loading = false), (state.product = action.payload));
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to fetch product"));
      })
      //getProductById
      .addCase(getProductById.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.product.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.product[index] = action.payload;
        } else {
          state.product.push(action.payload);
        }
      })
      .addCase(getProductById.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to fetch product"));
      })
      //updateProductDetails
      .addCase(updateProductDetails.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(updateProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.product.findIndex((item) => {
          item.id === action.payload.id;
        });
        if (index !== -1) {
          state.product[index] = action.payload;
        }
      })
      .addCase(updateProductDetails.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to update product"));
      })
      //deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.product = state.product.filter(
          (item) => item.id !== action.meta.arg.product_id,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        ((state.loading = false),
          (state.error = action.payload || "failed to delete product"));
      });
  },
});

export default productSlice.reducer;
