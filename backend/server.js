import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config({ path: "./backend/config/config.env" });
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const port = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`sushutting down the server due to uncaught exception`);
  process.exit(1);
});
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`sushutting down the server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
