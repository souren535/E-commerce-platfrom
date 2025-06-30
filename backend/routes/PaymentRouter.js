import express from "express";
import { verifyUserAuth } from "../middleware/userAuth.js";
import {
  paymentVerification,
  ProcessPayment,
  sendApiKey,
} from "../controllers/PaymentController.js";
const router = express.Router();

router.route("/process").post(verifyUserAuth, ProcessPayment);
router.route("/getKey").get(verifyUserAuth, sendApiKey);
router.route("/paymentVerification").post(paymentVerification);
export default router;
