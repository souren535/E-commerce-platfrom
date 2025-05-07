import express from "express";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  GetSingleProduct,
  restoreProduct,
  updateProducts,
} from "../controllers/productsController.js";
const router = express.Router();

router.route("/create").post(createProducts);
router.route("/list").post(getAllProducts);
router.route("/list/:id").post(GetSingleProduct);
router.route("/update/:id").put(updateProducts);
router.route("/delete/:id").delete(deleteProduct);
router.route("/restore/:id").post(restoreProduct);

export default router;
