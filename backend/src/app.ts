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
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productrouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
export default app;
