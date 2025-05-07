import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config({ path: "./backend/config/config.env" });
connectDB();
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
