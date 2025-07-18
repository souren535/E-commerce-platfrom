import { Product, productValidationSchema } from "../models/productModel.js";
import HandleEror from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import JoiValidation from "../utils/joivalidation.js";
import { v2 as cloudinary } from "cloudinary";
import { mongoose } from "mongoose";

//  CreateProduct
export const createProducts = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, productValidationSchema).validator();

    let image = [];
    if (typeof req.body.image === "string") {
      image.push(req.body.image);
    } else if (Array.isArray(req.body.image)) {
      image = req.body.image;
    } else if (req.body.image) {
      image = [req.body.image];
    } else {
      image = [];
    }

    if (!image || !image.length) {
      return next(new HandleEror("No images provided", 400));
    }

    const imageLinks = [];
    for (let i = 0; i < image.length; i++) {
      const result = await cloudinary.uploader.upload(image[i], {
        folder: "Products",
      });
      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imageLinks;

    const result = await Product.findOne({ name: req.body.name });
    if (result) return next(new HandleEror("Product already exists", 400));

    req.body.user = req.user.id;
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      success: true,
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
    const resultPerPage = parseInt(req.query.limit) || 10;
    const apiFeture = new APIFunctionality(
      Product.find({ is_deleted: false }),
      req.query
    )
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

// getProductSuggestions
export const getProductSuggestions = handleAsyncError(
  async (req, res, next) => {
    const keyword = req.query.keyword?.trim();

    // Return early if no keyword
    if (!keyword) {
      return res
        .status(200)
        .json({ success: true, suggestions: [], message: "No result found" });
    }

    const suggestions = await Product.find({
      name: { $regex: keyword, $options: "i" },
    }).select("name _id price description image stock ratings");

    res.status(200).json({ suggestions });
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

    let images = [];
    if (req.body.image === "String") {
      images.push(req.body.image);
    } else if (Array.isArray(req.body.image)) {
      images = req.body.image;
    }

    // destroy images
    if (images.length > 0) {
      for (let i = 0; i < product.image.length; i++) {
        await cloudinary.uploader.destroy(product.image[i].public_id);
      }
    }

    // uploads images
    let imageLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "Products",
      });

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imageLinks;

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,

      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "product updated successfully",
      updateProduct,
    });
  } catch (error) {
    next(new HandleEror(error.message, 500));
  }
});

// Soft_deleteProduct
export const deleteProduct = handleAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      is_deleted: false,
    });

    if (!product) return next(new HandleEror("Product not found", 404));

    product.is_deleted = true;

    const result = await product.save({ validateBeforeSave: false });

    if (result) {
      return res.status(200).json({
        message: "Product deleted successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new HandleEror(error.message, 500));
  }
});

// get soft deleted product
export const getsoftdeletedProduct = handleAsyncError(
  async (req, res, next) => {
    try {
      const products = await Product.find({ is_deleted: true });
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// parmanant delete product

export const parmanentDeleteProducts = handleAsyncError(
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return next(new HandleEror("Product not found", 404));

      if (product.image && product.image.length > 0) {
        for (let i = 0; i < product.image.length; i++) {
          await cloudinary.uploader.destroy(product.image[i].public_id);
        }
      }

      const deleteProduct = await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        product: deleteProduct,
      });
    } catch (error) {
      next(new HandleEror(error.message, 500));
    }
  }
);

// RestoreProduct
export const restoreProduct = handleAsyncError(async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      is_deleted: true,
    });

    if (!product) {
      return next(new HandleEror("Product not found", 404));
    }

    // Restore the product without triggering full validation
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { is_deleted: false },
      { new: true } // return updated doc
    );

    res.status(200).json({
      success: true,
      message: "Product restored successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    next(new HandleEror(error.message, 500));
  }
});

//  admin - get all products
export const getAdminProduct = handleAsyncError(async (req, res, next) => {
  try {
    const products = await Product.find({ is_deleted: false });
    res.status(200).json({
      success: true,
      message: "products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
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
      reviews: product.reviews,
    });
  } catch (error) {
    return next(new HandleEror("Internal Server Error", 500));
  }
});

// delete product review

export const deleteReview = handleAsyncError(async (req, res, next) => {
  try {
    const { productId, id: reviewId } = req.query;

    if (!productId || !reviewId) {
      return next(new HandleEror("Missing productId or reviewId", 400));
    }

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
      return next(new HandleEror("Invalid productId or reviewId", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new HandleEror("Product not found", 404));
    }

    const filteredReviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    const sum = filteredReviews.reduce((acc, r) => acc + r.rating, 0);
    const ratings =
      filteredReviews.length > 0 ? sum / filteredReviews.length : 0;

    product.reviews = filteredReviews;
    product.ratings = ratings;
    product.numOfReviews = filteredReviews.length;

    await product.save({ validateModifiedOnly: true });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return next(new HandleEror("Internal Server Error", 500));
  }
});
