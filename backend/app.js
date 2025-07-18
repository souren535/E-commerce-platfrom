import express from "express";
import product from "./routes/productRouters.js";
import user from "./routes/userRouter.js";
import order from "./routes/orderRouters.js";
import errorHandlerMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import payment from "./routes/PaymentRouter.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(fileUpload());

// Importing routes
app.use("/api/product", product);
app.use("/api/user", user);
app.use("/api/order", order);
app.use("/api/payment", payment);

// server static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// Error handling middleware
app.use(errorHandlerMiddleware);
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./backend/config/config.env" });
}
export default app;
