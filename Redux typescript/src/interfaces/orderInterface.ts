export interface orderDetailsFromBackend {
  order_id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemDetails {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  description: string;
  category: string;
}

export interface OrderDetails {
  order: orderDetailsFromBackend;
  items: OrderItemDetails[];
}

export interface OrderID {
  order_id: string;
}

export interface OrderIDStatus {
  order_id: string;
  status: string;
}
