import { orderModel, orderValidationSchema } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { userModel } from "../models/userModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import JoiValidation from "../utils/joivalidation.js";
import HandleEror from "../utils/handleError.js";

export const createNewOrder = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, orderValidationSchema);
    let {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    const order = await orderModel.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
    if (order) {
      res.status(201).json({
        success: true,
        message: "Oredr created successfullt",
        order,
      });
    }
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});
