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
  .route("/admin/OrderDetails/:id")
  .get(verifyUserAuth, roleBaseAccess("admin"), getSingleOrder);

router.route("/orderDetail/:id").get(verifyUserAuth, getSingleOrder);

router.route("/orders/user").get(verifyUserAuth, getAllOrder);
router
  .route("/getAll/adminOrders")
  .post(verifyUserAuth, roleBaseAccess("admin"), getAllOrders);

router
  .route("/adminUpdate/orderStatus/:id")
  .put(verifyUserAuth, roleBaseAccess("admin"), updateOrderStatus);

router
  .route("/admin/deleteOrder/:id")
  .delete(verifyUserAuth, roleBaseAccess("admin"), deleteDeliveredOrder);

export default router;
