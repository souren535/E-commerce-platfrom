import HandleEror from "../utils/handleError.js";

// Error handling middleware
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    const message = `Invalid ID format: ${err.value}`;
    err = new HandleEror(message, 400); // 400 = Bad Request
  }
  

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
