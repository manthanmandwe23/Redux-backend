export interface ProductDatafromBackend {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}
export interface ProductDatafromFrontend {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
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
    product_id: string
}