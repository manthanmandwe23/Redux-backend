export interface CartData {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartData {
  product_id: string;
  quantity: number;
}
export interface ProductIdData {
  product_id: string;
}