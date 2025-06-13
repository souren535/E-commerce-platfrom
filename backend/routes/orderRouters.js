import express from "express";
import {
  createNewOrder,
  deleteDeliveredOrder,
  getAllOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route("/create").post(verifyUserAuth, createNewOrder);
router
  .route("/get/:id")
  .post(verifyUserAuth, roleBaseAccess("admin"), getSingleOrder);

router.route("/orders/user").post(verifyUserAuth, getAllOrder);
router
  .route("/getAll")
  .post(verifyUserAuth, roleBaseAccess("admin"), getAllOrders);

router
  .route("/orderStatus/:id")
  .put(verifyUserAuth, roleBaseAccess("admin"), updateOrderStatus);

router
  .route("/deleteOrder/:id")
  .delete(verifyUserAuth, deleteDeliveredOrder);

export default router;
