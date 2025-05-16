import mongoose from "mongoose";
import Joi from "joi";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be positive"],
    MaxLength: [7, "Price cannot exceed 7 digits"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
  stock: {
    type: Number,
    required: [true, "Stock count is required"],
    min: [0, "Stock cannot be negative"],
    MaxLength: [5, "Price cannot exceed 5 digits"],
    default: 1,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: [true, "Reviewer name is required"],
      },
      rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
      },
      comment: {
        type: String,
        required: [true, "Comment is required"],
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const Product = mongoose.model("Product", productSchema);

const productValidationSchema = Joi.object({
  name: Joi.string().trim().empty().required().messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name empty is not Allowed",
    "any.required": "Product name is required",
  }),

  price: Joi.number().min(0).max(9999999).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be a positive number",
    "number.max": "Price cannot exceed 7 digits",
    "any.required": "Product price is required",
  }),

  description: Joi.string().required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Product description is required",
    "any.required": "Product description is required",
  }),

  image: Joi.array()
    .items(
      Joi.object({
        public_id: Joi.string().required().messages({
          "string.base": "Image public_id must be a string",
          "string.empty": "Image public_id is required",
          "any.required": "Image public_id is required",
        }),
        url: Joi.string().uri().min(1).required().messages({
          "string.base": "Image URL must be a string",
          "string.empty": "Image URL is not allowed to be empty",
          "string.min": "Image URL is not allowed to be empty",
          "string.uri": "Image URL must be a valid URI",
          "any.required": "Image URL is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Images must be an array of objects",
      "array.min": "At least one image is required",
      "any.required": "Product images are required",
    }),

  category: Joi.string().required().messages({
    "string.base": "Category must be a string",
    "string.empty": "Product category is required",
    "any.required": "Product category is required",
  }),

  stock: Joi.number().min(0).max(99999).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
    "number.max": "Stock cannot exceed 5 digits",
    "any.required": "Stock count is required",
  }),

  ratings: Joi.number().min(0).max(5).optional().messages({
    "number.base": "Ratings must be a number",
    "number.min": "Ratings cannot be less than 0",
    "number.max": "Ratings cannot exceed 5",
  }),

  numOfReviews: Joi.number().min(0).optional().messages({
    "number.base": "Number of reviews must be a number",
    "number.min": "Number of reviews cannot be negative",
  }),

  reviews: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "string.base": "Reviewer name must be a string",
          "string.empty": "Reviewer name is required",
          "any.required": "Reviewer name is required",
        }),
        rating: Joi.number().min(1).max(5).required().messages({
          "number.base": "Rating must be a number",
          "number.min": "Rating must be at least 1",
          "number.max": "Rating cannot exceed 5",
          "any.required": "Rating is required",
        }),
        comment: Joi.string().required().messages({
          "string.base": "Comment must be a string",
          "string.empty": "Comment is required",
          "any.required": "Comment is required",
        }),
      })
    )
    .optional(),
  user: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid user ObjectId");
      }
      return value;
    })
    .optional(),
  is_deleted: Joi.boolean().default(false),

  createdAt: Joi.date().optional(),
});

export { Product, productValidationSchema };
