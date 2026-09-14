export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_public_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductDatafromBackend {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: ProductImage[];
}
export interface ProductDatafromFrontend {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: File[];
}

export interface GetProductDetails {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductId {
  product_id: string;
}

export interface UpdateProductData {
  product_id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: File[];
}


