import pool from "../config/db.js";
import {
  getCartDetails,
  insertAddtocartdetails,
  IsProductAlreadyExists,
} from "../repository/cart_repository.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";

const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.params;
  const { quantity } = req.body;
  const user_id = req.user?.id;
  if (
    !product_id ||
    typeof product_id !== "string" ||
    typeof quantity !== "number" ||
    quantity <= 0 ||
    quantity == null ||
    !user_id
  ) {
    throw new ApiError(400, "required details are missing");
  }
  const existingCartItem = await IsProductAlreadyExists(product_id, user_id);

  let cartdata;
  if (existingCartItem) {
    const result = await pool.query(
      `update cart_items 
        set quantity = quantity + $1,
        updated_at = now()
        where user_id = $2 and product_id = $3
        returning *
        `,
      [quantity, user_id, product_id],
    );
    cartdata = result.rows[0];
  } else {
    cartdata = await insertAddtocartdetails(user_id, product_id, quantity);
  }

  if (!cartdata) {
    throw new ApiError(500, "failed to add product to cart");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, cartdata, "product added to cart successfully"));
});

const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    throw new ApiError(409, "unauthorized user");
  }
  const cartdetails = await getCartDetails(user_id);
  if (cartdetails === undefined || cartdetails === null) {
    throw new ApiError(500, "failed to fetched cart details");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, cartdetails, "cart fetched successfully"));
});
//updateCartItem means change the quantity of an existing product in the cart.
const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.params;
  const user_id = req.user?.id;
  const { quantity } = req.body;
  if (
    !product_id ||
    typeof product_id !== "string" ||
    quantity <= 0 ||
    quantity == null ||
    !user_id
  ) {
    throw new ApiError(400, "details are required to update cart");
  }

  const cartresult = await pool.query(
    `update cart_items 
    set quantity = $1,
    updated_at = now()
    where user_id = $2 and product_id = $3
    returning *`,
    [quantity, user_id, product_id],
  );

  if (cartresult.rows.length === 0) {
    throw new ApiError(500, "failed to update cart");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, cartresult.rows[0], "cart updated successfully"),
    );
});

const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.params;
  const user_id = req.user?.id;
  if (!product_id || !user_id) {
    throw new ApiError(401, "unauthorized request");
  }

  const deletedproduct = await pool.query(
    `delete from cart_items
    where product_id = $1 and user_id = $2 returning *`,
    [product_id, user_id],
  );
  if (deletedproduct.rows.length === 0) {
    throw new ApiError(404, "product not found in cart");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedproduct.rows[0],
        "product successfully removed from cart",
      ),
    );
});

const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    throw new ApiError(401, "unauthorized user");
  }
  const deletedproductrs = await pool.query(
    `delete from cart_items
    where user_id = $1 returning *`,
    [user_id],
  );
  if (deletedproductrs.rows.length === 0) {
    throw new ApiError(404, "cart is already empty");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "cart cleared successfully"));
});

export { addToCart, getCart, updateCartItem, removeFromCart, clearCart };
