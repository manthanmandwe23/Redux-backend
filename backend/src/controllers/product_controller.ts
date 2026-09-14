import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import uploadOnCloudinary from "../utils/cloudinary.js";
import {
  createProduct,
  getProductImages,
  insertProductImages,
  updateProduct,
} from "../repository/product_repository.js";
import ApiResponse from "../utils/ApiResponse.js";
import pool from "../config/db.js";
import { getProduct } from "../repository/getProduct_repository.js";
import { deleteCloudinaryImages } from "../utils/deleteFromCloudinary.js";

const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, stock, category } = req.body;
  if (
    [name, description, category].some((field) => {
      return !field.trim();
    })
  ) {
    throw new ApiError(400, "product details required");
  }
  //beacuse price and stock can be 0
  if (price == null || stock == null) {
    throw new ApiError(400, "product details required");
  }
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new ApiError(400, "product images are required");
  }

  const uploadImages = [];
  for (const file of files) {
    const uploadImage = await uploadOnCloudinary(file.path);
    if (!uploadImage) {
      throw new ApiError(500, "failed to upload on cloudinary");
    }
    uploadImages.push(uploadImage);
  }

  const product = await createProduct(
    name,
    description,
    price,
    stock,
    category,
  );

  for (const image of uploadImages) {
    await insertProductImages(product.id, image.secure_url, image.public_id);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "product created Successfully"));
});

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const sort = String(req.query.sort) || "newest";

  const category = req.query.category ? String(req.query.category) : undefined;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  const search = req.query.search ? String(req.query.search) : undefined;

  if (page < 1) {
    throw new ApiError(400, "page must be atleast 1");
  }
  if (limit < 1 || limit > 100) {
    throw new ApiError(400, "limit must be between 1 and 100");
  }
  const products = await getProduct({
    page,
    limit,
    sort,
    category,
    minPrice,
    maxPrice,
    search,
  });

  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      const images = await getProductImages(product.id);

      return {
        ...product,
        images: images,
      };
    }),
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, productsWithImages, "products fetched successfully"),
    );
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.params;
  if (typeof product_id !== "string") {
    throw new ApiError(401, "product id should be string");
  }
  const product = await pool.query(
    `select * from product
        where id = $1
        `,
    [product_id],
  );
  if (product.rows.length === 0) {
    throw new ApiError(400, "unable to find product");
  }
  const images = await getProductImages(product_id);

  const productWithImages = {
    ...product.rows[0],
    images,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(200, productWithImages, "product fetched successfully"),
    );
});

const updateProductDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { product_id } = req.params;
    if (typeof product_id !== "string") {
      throw new ApiError(400, "product id is not valid");
    }
    const { name, description, category } = req.body;
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const files = req.files as Express.Multer.File[] | undefined;

    if (
      name === undefined &&
      description === undefined &&
      price === undefined &&
      stock === undefined &&
      category === undefined &&
      (!files || files.length === 0)
    ) {
      throw new ApiError(400, "no data provided for update");
    }

    const updatedProduct = await updateProduct(product_id, {
      name,
      description,
      price,
      stock,
      category,
    });
    //productImages explnation is in onenote productImages file
    let productImages;
    if (files && files.length > 0) {
      const oldImages = await getProductImages(product_id);
      for (const img of oldImages) {
        await deleteCloudinaryImages(img.image_public_id);
      }
      await pool.query(
        `delete from product_images
           where product_id = $1`,
        [product_id],
      );
      for (const file of files) {
        const uploadedImage = await uploadOnCloudinary(file.path);
        if (!uploadedImage) {
          throw new ApiError(500, "failed to upload images");
        }
        await insertProductImages(
          product_id,
          uploadedImage.secure_url,
          uploadedImage.public_id,
        );
      }
    }
    productImages = await getProductImages(product_id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...updatedProduct,
          images: productImages,
        },
        "product details updated successfully",
      ),
    );
  },
);

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.params;
  if (!product_id || typeof product_id !== "string") {
    throw new ApiError(400, "product id required or it is not valid");
  }

  const product = await pool.query(
    `delete from product
    where id = $1
    returning *
    `,
    [product_id],
  );
  //   when we do RETURNING *.
  //   If rows.length === 0 → nothing was deleted.
  //   If rows.length === 1 → product was successfully deleted.
  if (product.rows.length === 0) {
    throw new ApiError(404, "product not found");
  }

  const oldImages = await getProductImages(product_id);
  for (const img of oldImages) {
    await deleteCloudinaryImages(img.public_id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "product deleted successfully"));
});

export {
  addProduct,
  getProductById,
  getAllProducts,
  updateProductDetails,
  deleteProduct,
};
