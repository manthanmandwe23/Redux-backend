import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order_controller.js";

const orderRouter = Router();

orderRouter.route("/createOrder").post(verifyJWT, createOrder);
orderRouter.route("/getMyOrders").get(verifyJWT, getMyOrders);
orderRouter.route("/getOrderById/:order_id").get(verifyJWT, getOrderById);
orderRouter
  .route("/updateOrderStatus/:order_id")
  .patch(verifyJWT, updateOrderStatus);
orderRouter.route("/cancelOrder/:order_id").patch(verifyJWT, cancelOrder);

export { orderRouter };
