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
import APIFunctionality from "../utils/apiFunctionality.js";
import { v2 as cloudinary } from "cloudinary";

// user registration
export const userRegister = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, registerValidation).validator();
    let { name, email, password, avatar } = req.body;
    const result = await userModel.findOne({ email: email });
    if (result) return next(new HandleEror("User Already Exists", 409));

    let avatarData = {
      public_id: null,
      url: null,
    };

    if (avatar && avatar.startsWith("data:image")) {
      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "Avatars",
        width: 150,
        crop: "scale",
      });

      avatarData = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (hash) {
          const user = await userModel.create({
            name,
            email,
            password: hash,
            avatar: avatarData,
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
    const user = await userModel.findById(req.user.id);
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

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
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
  let { newPassword } = req.body;

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

// update password -

export const updatePassword = handleAsyncError(async (req, res, next) => {
  try {
    let { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await userModel.findById(req.user.id).select("+password");
    if (!user) return next(new HandleEror("User not found", 404));

    if (!user.password) {
      return next(new HandleEror("User password not found", 500));
    }
    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) return next(new HandleEror("oldPassword is incorrect", 400));

    if (newPassword !== confirmPassword) {
      return next(new HandleEror("Confirm password does't match", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(newPassword, salt);
    user.password = hashPass;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    return next(new HandleEror("internal server error", 500));
  }
});

// update profile -

export const updateProfile = handleAsyncError(async (req, res, next) => {
  try {
    const { name, email, color, avatar } = req.body;

    const updateDetails = {
      name,
      email,
      color,
    };
    const user = await userModel.findById(req.user.id);
    if (avatar && avatar.startsWith("data:image")) {
      const imageId = user.avatar?.public_id;
      if (user.avatar && imageId) {
        await cloudinary.uploader.destroy(imageId);
      }
      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "Avatars",
        width: 150,
        crop: "scale",
      });

      updateDetails.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

    }
    const userData = await userModel.findByIdAndUpdate(
      req.user.id,
      updateDetails,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "profile update successfully",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// admin getting user information -

export const getUserList = handleAsyncError(async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});

export const getSingleUser = handleAsyncError(async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(new HandleEror("User doesn't exist, with this id", 404));
    }
    res.status(200).json({
      seccess: true,
      user,
    });
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});

// admin update user role -

export const updateRole = handleAsyncError(async (req, res, next) => {
  try {
    let { role } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return next(new HandleEror("User doesn't exist, with this id", 404));
    }
    res.status(200).json({
      success: true,
      message: "user role update successfully",
      user,
    });
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});

// admin - delete user -

export const deleteUser = handleAsyncError(async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(new HandleEror("user doesn't exist", 400));
    }

    // const imageId = user.avatar?.public_id;
    // if (user.avatar && imageId) {
    //   await cloudinary.uploader.destroy(imageId);
    //   console.log("Avatar deleted from cloudinary");
    // }
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      seccess: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});
