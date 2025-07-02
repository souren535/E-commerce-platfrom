import express from "express";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";

import {
  createProductReview,
  createProducts,
  deleteProduct,
  deleteReview,
  getAdminProduct,
  getAllProducts,
  getAllReviews,
  getProductSuggestions,
  GetSingleProduct,
  restoreProduct,
  updateProducts,
} from "../controllers/productsController.js";
const router = express.Router();

// user product

router.route("/list").post(getAllProducts);
router.route("/suggestions").get(getProductSuggestions);
router.route("/list/:id").get(GetSingleProduct);

// admin products

router
  .route("/admin/create")
  .post(verifyUserAuth, roleBaseAccess("admin"), createProducts);
router
  .route("/admin/update/:id")
  .put(verifyUserAuth, roleBaseAccess("admin"), updateProducts);
router
  .route("/admin/delete/:id")
  .delete(verifyUserAuth, roleBaseAccess("admin"), deleteProduct);
router
  .route("/admin/restore/:id")
  .post(verifyUserAuth, roleBaseAccess("admin"), restoreProduct);

router
  .route("/admin/list")
  .get(verifyUserAuth, roleBaseAccess("admin"), getAdminProduct);

// product Review -
router.route("/review").put(verifyUserAuth, createProductReview);

// get all product reviews -
router.route("/getall/reviews").post(verifyUserAuth, getAllReviews);

// delete product review
router.route("/delete/reviews").delete(verifyUserAuth, deleteReview);

export default router;
