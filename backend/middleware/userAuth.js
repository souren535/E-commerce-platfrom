import { userModel } from "../models/userModel.js";
import HandleEror from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return next(
      new HandleEror(
        "Authnetication is missing!please login to access resource",
        401
      )
    );

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await userModel.findById(decoded.id);
    next();
  } catch (error) {
    console.log(error);
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
