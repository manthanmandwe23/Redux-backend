// order = the overall purchase
// One row represents one complete order.

//order_items = products inside that order
// One row represents one product in an order.
export interface Order {
  order_id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}
