import express from "express";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";

import {
  createProducts,
  deleteProduct,
  getAllProducts,
  GetSingleProduct,
  restoreProduct,
  updateProducts,
} from "../controllers/productsController.js";
const router = express.Router();

router
  .route("/create")
  .post(verifyUserAuth, roleBaseAccess("admin"), createProducts);
router.route("/list").post(verifyUserAuth, getAllProducts);
router.route("/list/:id").post(verifyUserAuth, GetSingleProduct);
router
  .route("/update/:id")
  .put(verifyUserAuth, roleBaseAccess("admin"), updateProducts);
router
  .route("/delete/:id")
  .delete(verifyUserAuth, roleBaseAccess("admin"), deleteProduct);
router
  .route("/restore/:id")
  .post(verifyUserAuth, roleBaseAccess("admin"), restoreProduct);

export default router;
