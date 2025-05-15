import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // hide password by default
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// password verifycation
userSchema.methods.verifyPassword = async function (userEnteredPassword) {
  if (!this.password) {
    throw new Error("Password is not defined on the user object");
  }
  return await bcrypt.compare(userEnteredPassword, this.password);
};

// generating reset password token :-
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000; //5min
  return resetToken;
};

const userModel = mongoose.model("user", userSchema);

const registerValidation = Joi.object({
  name: Joi.string().min(3).max(100).empty().required().messages({
    "string.base": "Name must be a text value.",
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters.",
    "string.max": "Name must be at most 100 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().empty().messages({
    "string.base": "Email must be a text value.",
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().empty().messages({
    "string.base": "Password must be a text value.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
  avatar: Joi.object({
    public_id: Joi.string().optional().messages({
      "string.empty": "Avatar public_id is required.",
    }),
    url: Joi.string().uri().optional().messages({
      "string.empty": "Avatar URL is required.",
      "string.uri": "Avatar URL must be a valid URI.",
    }),
  })
    .optional()

    .messages({
      "object.base": "Avatar is required and must include public_id and url.",
      "any.required": "Avatar is required.",
    }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().empty().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().empty().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

export { userModel, registerValidation, loginValidation };
