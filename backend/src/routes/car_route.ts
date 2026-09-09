import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart_controller.js";

const cartRouter = Router();

cartRouter.route("/addToCart/:product_id").post(verifyJWT, addToCart);
cartRouter.route("/getCart").get(verifyJWT, getCart);
cartRouter
  .route("/updateCartItem/:product_id")
  .patch(verifyJWT, updateCartItem);
cartRouter
  .route("/removeFromCart/:product_id")
  .delete(verifyJWT, removeFromCart);
cartRouter.route("/clearCart").delete(verifyJWT, clearCart);

export { cartRouter };
