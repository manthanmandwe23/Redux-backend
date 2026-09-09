import pool from "../config/db.js";

const insertAddtocartdetails = async (
  user_id: string,
  product_id: string,
  quantity: number,
) => {
  const result = await pool.query(
    `insert into cart_items (user_id, product_id, quantity)
        values ($1, $2, $3) returning *`,
    [user_id, product_id, quantity],
  );
  return result.rows[0];
};

const IsProductAlreadyExists = async (product_id: string, user_id: string) => {
  const result = await pool.query(
    `
    select * from cart_items where product_id = $1 and user_id= $2`,
    [product_id, user_id],
  );

  return result.rows[0];
};

const getCartDetails = async (user_id: string) => {
    // what we done here when user will visit cart the product details will get shown so we joined product table with cart table on the basics of product_id and where user_id matches 
  const result = await pool.query(
    `select c.id, c.quantity, p.id as product_id, p.name, p.description, p.price, p.stock, p.category from cart_items c join product p on c.product_id = p.id where c.user_id = $1`,
    [user_id],
  );
  return result.rows;
};
export { insertAddtocartdetails, IsProductAlreadyExists, getCartDetails };


/**
 * Next: we should check whether the same product_id is already in the user's cart, so adding it again should increase quantity instead of creating a duplicate row.
i did not understand what did you said

It means this:

Suppose your cart currently has:

user_id	product_id	quantity
U1	P10	2

Now the same user clicks Add to Cart for P10 again with quantity 3.

We don't want:

user_id	product_id	quantity
U1	P10	2
U1	P10	3

Instead, we want:

user_id	product_id	quantity
U1	P10	5

So addToCart should first check:

"Does this user already have this product in their cart?"

If yes → increase quantity.
If no → insert a new row.


JOIN belongs in the backend, not the frontend.

addToCart → usually just INSERT into cart_items. No JOIN needed.
getCart → use JOIN to fetch product details and username.
addToCart
Frontend → Backend → INSERT cart_items

getCart
Frontend → Backend → SELECT + JOIN → return complete cart

This keeps database logic inside your backend.
 */