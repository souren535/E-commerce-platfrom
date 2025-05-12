import handleAsyncError from "../middleware/handleAsyncError.js";
import {
  loginValidation,
  registerValidation,
  userModel,
} from "../models/userModel.js";
import HandleEror from "../utils/handleError.js";
import JoiValidation from "../utils/joivalidation.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";

export const userRegister = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, registerValidation).validator();
    let { name, email, password } = req.body;
    const result = await userModel.findOne({ email: email });
    if (result) return next(new HandleEror("user already exists", 409));
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (hash) {
          const user = await userModel.create({
            name,
            email,
            password: hash,
            avatar: {
              public_id: "This is testing id",
              url: "https://example.com/temp-avatar.jpg",
            },
          });

          sendToken(user, 200, res);
        }
      });
    });
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});

export const userLogin = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, loginValidation).validator();
    let { email, password } = req.body;
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");
    if (!user) return next(new HandleEror("invalid email or password", 400));
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) return next(new HandleEror("invalid email or password", 401));

    sendToken(user, 200, res);
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});

export const userLogout = handleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

// Reset Password :-
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return next(new HandleEror("User does't exist", 400));
    let resetToken = user.generatePasswordToken();
    await user.save();
  } catch (error) {
    return next(
      new HandleEror("Could save reset token, Please try again later", 500)
    );
  }
});
