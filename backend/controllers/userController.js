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
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// user registration
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

// user Login
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

// user Details -

export const userDetails = handleAsyncError(async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(new HandleEror("User Not Found", 404));
    }
    res.status(200).json({
      success: true,
      message: "User Found Successfully",
      user,
    });
  } catch (error) {}
});

// user logout
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

// Forgot Password :-
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
  let resetToken;
  let user;
  try {
    user = await userModel.findOne({ email: req.body.email });
    if (!user) return next(new HandleEror("User does't exist", 400));
    resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(
      new HandleEror("Could save reset token, Please try again later", 500)
    );
  }

  const resetPasswordURL = `http://localhost/user/reset/${resetToken}`;
  const message = `Use the following link to reset your password: ${resetPasswordURL} - \n\n This link will expire in 5 minutes.\n\n
                   if  you didn't request a password reset, Please ignore this message.`;

  // send Email
  try {
    await sendEmail({
      email: user.email,
      subject: "password Reset Request",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email is sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleEror("Could save reset token, Please try again later", 500)
    );
  }
});

// Reset password -

export const resetPassword = handleAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new HandleEror("Reset password token is invalid or has been expired", 400)
    );
  }
  let { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return next(new HandleEror("password doesn't match", 400));
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    return next(
      new HandleEror("Could save reset token, Please try again later", 500)
    );
  }
});
