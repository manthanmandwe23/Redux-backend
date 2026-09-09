import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
import userRouter from "./routes/auth_route.js";
import { productrouter } from "./routes/product_route.js";
import { cartRouter } from "./routes/car_route.js";
import { orderRouter } from "./routes/order_route.js";
app.use("/api/user/v1", userRouter);
app.use("/api/product/v1", productrouter);
app.use("/api/cart/v1", cartRouter);
app.use("/api/orders/v1", orderRouter);
export default app;
