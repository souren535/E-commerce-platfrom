import express from "express";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";

import {
  createProducts,
  deleteProduct,
  getAdminProduct,
  getAllProducts,
  GetSingleProduct,
  restoreProduct,
  updateProducts,
} from "../controllers/productsController.js";
const router = express.Router();

// user product

router.route("/list").post(verifyUserAuth, getAllProducts);
router.route("/list/:id").post(verifyUserAuth, GetSingleProduct);

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
  .post(verifyUserAuth, roleBaseAccess("admin"), getAdminProduct);
export default router;
