import pool from "../config/db.js";

const createProduct = async (
  name: string,
  description: string,
  price: number,
  stock: number,
  category: string,
) => {
  const product = await pool.query(
    `insert into product (name, description, price, stock, category) values ($1, $2, $3, $4, $5) returning *`,
    [name, description, price, stock, category],
  );

  return product.rows[0];
};

const insertProductImages = async (
  product_id: string,
  image_url: string,
  image_public_id: string,
) => {
  const images = await pool.query(
    `insert into product_images (product_id, image_url, image_public_id)
    values ($1, $2, $3) returning *`,
    [product_id, image_url, image_public_id],
  );
  return images.rows[0];
};

const updateProduct = async (
  productId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
  },
) => {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    values.push(data.name);
    fields.push(`name = $${values.length}`);
  }
  if (data.description !== undefined) {
    values.push(data.description);
    fields.push(`description = $${values.length}`);
  }
  if (data.price !== undefined) {
    values.push(data.price);
    fields.push(`price = $${values.length}`);
  }
  if (data.stock !== undefined) {
    values.push(data.stock);
    fields.push(`stock = $${values.length}`);
  }
  if (data.category) {
    values.push(data.category);
    fields.push(`category = $${values.length}`);
  }
  if (fields.length === 0) {
    return null;
  }
  values.push(productId);

  const result = await pool.query(
    `update product
    set ${fields.join(", ")}, updated_at = now()
    where id = $${values.length}
    returning *`,
    values,
  );
  return result.rows[0];
};

const getProductImages = async (productId: string) => {
  const result = await pool.query(
    `SELECT * FROM product_images
     WHERE product_id = $1`,
    [productId],
  );
  return result.rows;
};

export { createProduct, insertProductImages, updateProduct, getProductImages };
