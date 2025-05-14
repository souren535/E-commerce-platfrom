import { Product, productValidationSchema } from "../models/productModel.js";
import HandleEror from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import JoiValidation from "../utils/joivalidation.js";

//  CreateProduct
export const createProducts = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, productValidationSchema).validator();

    req.body.user = req.user.id;

    const result = await Product.findOne({ name: req.body.name });
    if (result) return next(new HandleEror("Product already exists", 400));

    const newProduct = await Product.create(req.body);

    res.status(201).json({
      seccess: true,
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

// GetAllProducts
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  try {
    const resultPerPage = parseInt(req.query.limit) || 3;
    const apiFeture = new APIFunctionality(Product.find(), req.query)
      .seacrh()
      .filter();

    const filteredQuery = apiFeture.query.clone();
    const totalProducts = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(totalProducts / resultPerPage);
    const page = parseInt(req.query.page) || 1;

    if (page > totalPages && totalProducts > 0)
      return next(new HandleEror("This Page doesn't exist", 404));

    apiFeture.pagination(resultPerPage);
    const products = await apiFeture.query;
    if (!products || products.length === 0)
      return next(new HandleEror("No products found", 404));
    res.status(200).json({
      success: true,
      message: "products fetched successfully",
      totalProducts,
      totalPages,
      currentPage: page,
      products: products,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

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
      product,
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
