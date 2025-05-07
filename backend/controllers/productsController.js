import { Product, productValidationSchema } from "../models/productModel.js";
import HandleEror from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

//  CreateProduct
export const createProducts = handleAsyncError(async (req, res, next) => {
  try {
    const { error } = productValidationSchema.validate(req.body);
    if (error) {
      const messages = error.details.map((err) => err.message);
      return next(new HandleEror(messages, 400));
    }

    const result = await Product.findOne({ name: req.body.name });
    if (result) return next(new HandleEror("Product already exists", 400));

    const newProduct = await Product.create(req.body);

    next(new HandleEror("Product created successfully", 201));
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

// GetAllProducts
// export const getAllProducts = handleAsyncError(async (req, res, next) => {
//   try {
//     //  pagination parameters
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const filter = { is_deleted: false };
//     if (req.query.category) {
//       filter.category = req.query.category;
//     }

//     // case-insensitive search just like laptop in search lap
//     if (req.query.name) filter.name = { $regex: req.query.name, $options: "i" };

//     const total_count = await Product.countDocuments(filter);
//     const products = await Product.find(filter)
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });
//     if (products.length === 0)
//       return next(new HandleEror("No products found", 404));
//     res.status(200).json({
//       success: true,
//       message: "products fetched successfully",
//       total_count: total_count,
//       current_page: page,
//       total_pages: Math.ceil(total_count / limit),
//       products: products,
//     });
//   } catch (error) {
//     next(new HandleEror(error.message, 500));
//   }
// });

// GetSingleProductbyId
export const GetSingleProduct = handleAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    if (!product) return next(new HandleEror("Product not found", 404));
    res.status(200).json({
      success: true,
      message: "product fetched successfully",
      product: product,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

// UpdateProduct
export const updateProducts = handleAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new HandleEror("Product not found", 404));

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,

      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "product updated successfully",
      product: updateProduct,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

// Soft_deleteProduct
export const deleteProduct = handleAsyncError(async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    if (!product) return next(new HandleEror("Product not found", 404));
    product.is_deleted = true;
    const result = await product.save();
    if (result) next(new HandleEror("Product deleted successfully", 200));
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});
// RestoreProduct
export const restoreProduct = handleAsyncError(async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      is_deleted: true,
    });
    if (!product) next(new HandleEror("Product not found", 404));
    product.is_deleted = false;
    product.save();
    res.status(200).json({
      success: true,
      message: "Product restored successfully",
      product: product,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

export const getAllProducts = handleAsyncError(async (req, res, next) => {
  try {
    const resultPerPage = parseInt(req.query.limit) || 10;
    const total_count = await Product.countDocuments();
    const apiFunctionality = new APIFunctionality(Product.find(), req.query)
      .seacrh()
      .filter()
      .pagination(resultPerPage);
    const products = await apiFunctionality.query;
    if (products.length === 0)
      return next(new HandleEror("No products found", 404));
    res.status(200).json({
      success: true,
      message: "products fetched successfully",
      total_count: total_count,
      products: products,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});
