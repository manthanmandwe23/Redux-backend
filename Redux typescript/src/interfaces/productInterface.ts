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
//here we used File[] because when we sent file from frontend we need to use File because we are sending actual file from users computer which is of type File , and when backend sends file in that case we can use this  images: ProductImage[]; where ProductImage defines the file structure we defined in backend, so while sending from frontend - File and when from backend then in a way we defined in backend

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
