import pool from "../config/db.js";

interface GetProductOptions {
  page: number;
  limit: number;
  sort: string;
  category?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  search?: string | undefined;
}

const getProduct = async ({
  page,
  limit,
  sort,
  category,
  minPrice,
  maxPrice,
  search,
}: GetProductOptions) => {
  const offset = (page - 1) * limit;

  const values: (string | number)[] = [];
  const conditions: string[] = [];

  if (category !== undefined) {
    values.push(category);
    conditions.push(`category= $${values.length}`);
  }
  if (minPrice !== undefined) {
    values.push(minPrice);
    conditions.push(`price >= $${values.length}`);
  }
  if (maxPrice !== undefined) {
    values.push(maxPrice);
    conditions.push(`price <= $${values.length}`);
  }
  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name ilike $${values.length}`);
  }

  let orderBy = "created_at DESC";
  switch (sort) {
    case "oldest":
      orderBy = "created_at ASC";
      break;
    case "price_asc":
      orderBy = "price ASC";
      break;
    case "price_desc":
      orderBy = "price DESC";
      break;
    case "newest":
    default:
      orderBy = "created_at DESC";
      break;
  }

  const whereClause =
    conditions.length > 0 ? `where ${conditions.join(" and ")}` : "";

  values.push(limit);
  const limitposition = values.length;

  values.push(offset);
  const offsetposition = values.length;

  const result = await pool.query(
    `select * from product
     ${whereClause}
     order by ${orderBy}
     limit $${limitposition}
     offset $${offsetposition}
     `,
    values,
  );

  return result.rows;
};

export { getProduct };
