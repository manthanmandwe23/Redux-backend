import pool from "../config/db.js";
import {
  clearCartitems,
  insertEachItemInOrderItemsTable,
  insertIntoOrdersTable,
  updatestock,
} from "../repository/orders_repository.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { response, type Request, type Response } from "express";

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    throw new ApiError(401, "unauthorized user");
  }
  const cart = await pool.query(
    `select c.id, c.quantity, p.id as product_id, p.name, p.description, p.price, p.stock, p.category from cart_items c 
    join product p on c.product_id = p.id 
    where c.user_id = $1`,
    [user_id],
  );
  if (cart.rows.length === 0) {
    throw new ApiError(400, "cart is empty");
  }
  const total = cart.rows.reduce((acc, currval) => {
    return acc + currval.price * currval.quantity;
  }, 0);

  const client = await pool.connect();
  let response;
  try {
    await client.query("begin");

    for (const item of cart.rows) {
      if (item.stock < item.quantity) {
        throw new ApiError(400, `insufficient stock for ${item.name}`);
      }
    }
    response = await insertIntoOrdersTable(client, user_id, total, "pending");

    for (const item of cart.rows) {
      await insertEachItemInOrderItemsTable(
        client,
        response.order_id,
        item.product_id,
        item.quantity,
        item.price,
      );
    }
    for (const item of cart.rows) {
      await updatestock(client, item.product_id, item.quantity);
    }
    await clearCartitems(client, user_id);
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
  return res
    .status(201)
    .json(new ApiResponse(201, response, "order created successfully"));
});

const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    throw new ApiError(401, "unauthorized user");
  }
  const result = await pool.query(
    `select * from orders where user_id = $1 order by created_at desc`,
    [user_id],
  );
  if (result.rows.length === 0) {
    throw new ApiError(404, "order not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, result.rows, "orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const user_id = req.user?.id;

  if (!order_id || !user_id) {
    throw new ApiError(401, "unauthorized request");
  }
  const response = await pool.query(
    `select * from orders where order_id = $1 and user_id = $2`,
    [order_id, user_id],
  );
  if (response.rows.length === 0) {
    throw new ApiError(404, "order not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, response.rows[0], "order fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const { status } = req.body;
  if (!order_id || !status) {
    throw new ApiError(401, "insufficient credentials");
  }
  const validateStatus = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validateStatus.includes(status)) {
    throw new ApiError(400, "invalid order status");
  }
  const result = await pool.query(
    `update orders
    set status = $1, updated_at = now()
    where order_id = $2 returning *`,
    [status, order_id],
  );
  if (result.rows.length === 0) {
    throw new ApiError(404, "order not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, result.rows[0], "status updated successfully"));
});

const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const user_id = req.user?.id;
  if (!order_id || !user_id) {
    throw new ApiError(401, "insufficient credential");
  }

  const client = await pool.connect();
  let result;
  try {
    await client.query("begin");

    const response = await client.query(
      `select * from orders where order_id = $1 and user_id=$2 for update`,
      [order_id, user_id],
    );
    if (response.rows.length === 0) {
      throw new ApiError(400, "order does not belong to user");
    }
    if (
      response.rows[0].status !== "pending" &&
      response.rows[0].status !== "confirmed"
    ) {
      throw new ApiError(400, "order can not be cancelled");
    }

    const orderItems = await client.query(
      `select product_id , quantity
        from order_items 
        where order_id = $1`,
      [order_id],
    );

    for (const items of orderItems.rows) {
      await client.query(
        `update product
            set stock = stock + $1
            where id = $2
            returning *`,
        [items.quantity, items.product_id],
      );
    }
    result = await client.query(
      `update orders 
     set status = $1, updated_at = now()
     where order_id=$2 and user_id = $3 
     returning *`,
      ["cancelled", order_id, user_id],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result.rows[0], "order cancelled successfully"));
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
