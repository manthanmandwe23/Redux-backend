import type { PoolClient } from "pg";
import ApiError from "../utils/ApiError.js";
//You can say:
// "I used a PostgreSQL transaction for order creation so that creating the order, inserting order items, updating inventory, and clearing the cart either all succeed or all roll back. For inventory, I use a conditional atomic UPDATE with stock >= quantity to prevent the stock from becoming negative and to handle concurrent purchase attempts more safely."

const insertIntoOrdersTable = async (
  client: PoolClient,
  user_id: string,
  total_amount: number,
  status: string,
) => {
  const result = await client.query(
    `insert into orders (user_id, total_amount, status)
        values ($1, $2, $3) returning *`,
    [user_id, total_amount, status],
  );
  return result.rows[0];
};

const insertEachItemInOrderItemsTable = async (
  client: PoolClient,
  order_id: string,
  product_id: string,
  quantity: number,
  price: number,
) => {
  const result = await client.query(
    `insert into order_items (order_id, product_id,quantity,  price)
    values ($1, $2, $3, $4) returning *`,
    [order_id, product_id, quantity, price],
  );
  return result.rows;
};

const updatestock = async (
  client: PoolClient,
  product_id: string,
  quantity: number,
) => {
  const result = await client.query(
    `update product 
        set stock = stock - $1 where id = $2 and stock >= $1 returning *`,
    [quantity, product_id],
  );
  if (result.rows.length === 0) {
    throw new ApiError(400, "insufficient stock");
  }
  return result.rows;
};

const clearCartitems = async (client: PoolClient, user_id: string) => {
  await client.query(
    `delete from cart_items
        where user_id = $1`,
    [user_id],
  );
};

export {
  insertIntoOrdersTable,
  insertEachItemInOrderItemsTable,
  updatestock,
  clearCartitems,
};
