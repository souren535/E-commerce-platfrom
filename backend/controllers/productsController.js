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
    const resultPerPage = parseInt(req.query.limit) || 5;
    const apiFeture = new APIFunctionality(Product.find(), req.query)
      .search()
      .filter();

    const filteredQuery = apiFeture.query.clone();
    const productCounts = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(productCounts / resultPerPage);
    const page = parseInt(req.query.page) || 1;

    if (page > totalPages && productCounts > 0)
      return next(new HandleEror("This Page doesn't exist", 404));

    apiFeture.pagination(resultPerPage);
    const products = await apiFeture.query;
    if (!products || products.length === 0)
      return next(new HandleEror("No products found", 404));
    res.status(200).json({
      success: true,
      message: "products fetched successfully",
      productCounts,
      totalPages,
      resultPerPage,
      currentPage: page,
      products,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

// controller/productController.js
export const getProductSuggestions = handleAsyncError(
  async (req, res, next) => {
    const keyword = req.query.keyword?.trim();

    // Return early if no keyword
    if (!keyword) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const suggestions = await Product.find({
      name: { $regex: keyword, $options: "i" },
    })
      .select("name _id")
      .limit(5);

    res.status(200).json({ success: true, suggestions });
  }
);

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

//  admin - get all products
export const getAdminProduct = handleAsyncError(async (req, res, next) => {
  try {
    const resultPerPage = parseInt(req.query.limit) || 10;
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
    return next(new HandleEror(error.message, 500));
  }
});

//  create reviews
export const createProductReview = handleAsyncError(async (req, res, next) => {
  try {
    let { rating, comment, productId } = req.body;
    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    const product = await Product.findById(productId);
    const reviewExist = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );
    if (reviewExist) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          (review.rating = rating), (review.comment = comment);
        }
      });
    } else {
      product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let sum = 0;
    product.reviews.forEach((review) => {
      sum += review.rating;
    });
    product.ratings =
      product.reviews.length > 0 ? sum / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});

// get all reviews
export const getAllReviews = handleAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new HandleEror("Product Not Found", 400));
    res.status(200).json({
      seccess: true,
      name: product.name,
      reviews: product.reviews,
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});

// delete product review

export const deleteReview = handleAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return next(new HandleEror("Product not found", 400));
    }
    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.id.toString()
    );
    let sum = 0;
    reviews.forEach((review) => {
      sum += review.rating;
    });

    const ratings = reviews.length > 0 ? sum / reviews.length : 0;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "delete product review successfully",
      reviews:
        product.reviews.length > 0 ? product.reviews : "No reviews found",
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});
