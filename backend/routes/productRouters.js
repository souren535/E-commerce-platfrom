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
  getsoftdeletedProduct,
  parmanentDeleteProducts,
  restoreProduct,
  updateProducts,
} from "../controllers/productsController.js";
const router = express.Router();

// user product

router.route("/list").post(getAllProducts);
router.route("/suggestions").get(getProductSuggestions);

// --- MOVE THESE STATIC ROUTES ABOVE /list/:id ---
router
  .route("/admin/getall/reviews")
  .get(verifyUserAuth, roleBaseAccess("admin"), getAllReviews);

router
  .route("/admin/delete/reviews")
  .delete(verifyUserAuth, roleBaseAccess("admin"), deleteReview);
// ------------------------------------------------

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
  .route("/admin/getSoftDeleted/")
  .get(verifyUserAuth, roleBaseAccess("admin"), getsoftdeletedProduct);

router
  .route("/admin/restore/:id")
  .put(verifyUserAuth, roleBaseAccess("admin"), restoreProduct);

router
  .route("/admin/list")
  .get(verifyUserAuth, roleBaseAccess("admin"), getAdminProduct);

// product Review -
router.route("/review").put(verifyUserAuth, createProductReview);

// delete  parmanent product
router
  .route("/admin/parmanentDelete/:id")
  .delete(verifyUserAuth, parmanentDeleteProducts);

export default router;
