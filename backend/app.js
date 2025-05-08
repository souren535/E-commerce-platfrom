import express from "express";
import product from "./routes/productRouters.js";
import user from "./routes/userRouter.js";
import errorHandlerMiddleware from "./middleware/error.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing routes
app.use("/product", product);
app.use("/user", user);

// Error handling middleware
app.use(errorHandlerMiddleware);

export default app;
