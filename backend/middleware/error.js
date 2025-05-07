import HandleEror from "../utils/handleError.js";

// Error handling middleware
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError" && !err.statusCode) {
    const path = err.path || "input";
    const message = `This is invalid resource ${path}`;
    err = new HandleEror(message, 404);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
