import { orderModel, orderValidationSchema } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import JoiValidation from "../utils/joivalidation.js";
import HandleEror from "../utils/handleError.js";

// create new order
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

// get single order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("user", "name email");
    if (!order) {
      return next(new HandleEror("No Order Found", 404));
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return next(new HandleEror("Internal Server Error", 500));
  }
});

// Get all my order
export const getAllOrder = handleAsyncError(async (req, res, next) => {
  try {
    const orders = await orderModel.find({ user: req.user.id });
    if (!orders) {
      return next(new HandleEror("No Order Found", 404));
    }
    res.status(200).json({
      success: true,
      message: "order fetch successfully",
      orders,
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});

// Admin - Get all Orders

export const getAllOrders = handleAsyncError(async (req, res, next) => {
  try {
    const orders = await orderModel.find();
    if (!orders) {
      return next(new HandleEror("No Order Found", 404));
    }
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    res.status(200).json({
      success: true,
      message: "order fetch successfully",
      orders,
      totalAmount,
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});

// update order status -
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return next(new HandleEror("No Order Found", 404));
    }
    if (order.orderStatus === "Delivered") {
      return next(new HandleEror("This order is already been delivered", 404));
    }
    await Promise.all(
      order.orderItems.map((item) =>
        updateQuantity(item.product, item.quantity)
      )
    );
    order.orderStatus = req.body.status;
    if (order.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});

async function updateQuantity(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    return next(new HandleEror("Product Not Found", 404));
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete Delivered order

export const deleteDeliveredOrder = handleAsyncError(async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return next(new HandleEror("No Order Found", 404));
    }
    if (order.orderStatus !== "Delivered") {
      return next(
        new HandleEror(
          "This order is under processing and can't be deleted",
          404
        )
      );
    }
    await orderModel.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Delete order successfully",
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});
