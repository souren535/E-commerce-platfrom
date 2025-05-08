import mongoose from "mongoose";
import Joi from "joi";

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
    public_id: Joi.string().required().messages({
      "string.empty": "Avatar public_id is required.",
      "any.required": "Avatar public_id is required.",
    }),
    url: Joi.string().uri().required().messages({
      "string.empty": "Avatar URL is required.",
      "string.uri": "Avatar URL must be a valid URI.",
      "any.required": "Avatar URL is required.",
    }),
  })
    .required()
    .messages({
      "object.base": "Avatar is required and must include public_id and url.",
      "any.required": "Avatar is required.",
    }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

export { userModel, registerValidation, loginValidation };
