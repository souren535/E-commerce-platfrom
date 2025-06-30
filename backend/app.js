import express from "express";
import product from "./routes/productRouters.js";
import user from "./routes/userRouter.js";
import order from "./routes/orderRouters.js";
import errorHandlerMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import payment from "./routes/PaymentRouter.js";
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(fileUpload());

// Importing routes
app.use("/api/product", product);
app.use("/api/user", user);
app.use("/api/order", order);
app.use("/api/payment", payment);

// Error handling middleware
app.use(errorHandlerMiddleware);
dotenv.config({ path: "./backend/config/config.env" });
export default app;
