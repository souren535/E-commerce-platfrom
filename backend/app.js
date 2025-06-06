import express from "express";
import product from "./routes/productRouters.js";
import user from "./routes/userRouter.js";
import order from "./routes/orderRouters.js";
import errorHandlerMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Importing routes
app.use("/api/product", product);
app.use("/api/user", user);
app.use("/order", order);

// Error handling middleware
app.use(errorHandlerMiddleware);

export default app;
