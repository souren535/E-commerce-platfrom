import { userModel } from "../models/userModel.js";
import HandleEror from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next(new HandleEror("please login first", 401));

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await userModel.findById(decoded.id);
    if (!req.user) {
      return next(new HandleEror("User not found", 404));
    }
    next();
  } catch (error) {
    return next(new HandleEror("Invalid or expired token", 401));
  }
});

export const roleBaseAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HandleEror(
          `Role- ${req.user.role} is not allowed to access the resource`,
          403
        )
      );
    }
    next();
  };
};
