import mongoose from "mongoose";
import Joi from "joi";

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  orderStatus: {
    type: String,
    require: true,
    default: "Processing",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("Order", orderSchema);

const objectId = () =>
  Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation")
    .messages({
      "any.invalid": `"{{#label}}" must be a valid ObjectId`,
    });

const orderValidationSchema = Joi.object({
  shippingInfo: Joi.object({
    address: Joi.string().trim().min(5).max(100).required().messages({
      "string.base": `"address" should be a type of text`,
      "string.empty": `"address" cannot be empty`,
      "string.min": `"address" should be at least {#limit} characters`,
      "any.required": `"address" is required`,
    }),
    city: Joi.string().trim().min(2).max(50).required().messages({
      "any.required": `"city" is required`,
    }),
    state: Joi.string().trim().min(2).max(50).required().messages({
      "any.required": `"state" is required`,
    }),
    country: Joi.string().trim().min(2).max(50).required().messages({
      "any.required": `"country" is required`,
    }),
    pinCode: Joi.number().min(100000).max(999999).required().messages({
      "number.base": `"pinCode" must be a number`,
      "any.required": `"pinCode" is required`,
    }),
    phoneNo: Joi.number().min(1000000000).max(9999999999).required().messages({
      "number.base": `"phoneNo" must be a number`,
      "any.required": `"phoneNo" is required`,
    }),
  }).required(),

  orderItems: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().min(2).required().messages({
          "any.required": `"item name" is required`,
        }),
        price: Joi.number().min(0).required().messages({
          "any.required": `"price" is required`,
        }),
        quantity: Joi.number().min(1).required().messages({
          "any.required": `"quantity" is required`,
        }),
        image: Joi.string().uri().required().messages({
          "string.uri": `"image" must be a valid URI`,
          "any.required": `"image" is required`,
        }),
        product: objectId().required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": `"orderItems" must be an array`,
      "array.min": `"orderItems" must contain at least one item`,
      "any.required": `"orderItems" is required`,
    }),

  user: objectId().required(),

  paymentInfo: Joi.object({
    id: Joi.string().required().messages({
      "any.required": `"payment id" is required`,
    }),
    status: Joi.string()
      .valid("success", "pending", "failed")
      .required()
      .messages({
        "any.only": `"status" must be one of [success, pending, failed]`,
        "any.required": `"status" is required`,
      }),
  }).required(),

  paidAt: Joi.date().iso().required().messages({
    "date.format": `"paidAt" must be a valid ISO date`,
    "any.required": `"paidAt" is required`,
  }),

  itemPrice: Joi.number().min(0).required(),
  taxPrice: Joi.number().min(0).required(),
  shippingPrice: Joi.number().min(0).required(),
  totalPrice: Joi.number().min(0).required(),

  deliveredAt: Joi.date().iso().optional(),

  createdAt: Joi.date().iso().optional(),
});

export { orderModel, orderValidationSchema };
