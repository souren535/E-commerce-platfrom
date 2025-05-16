import express from "express";
import { createNewOrder } from "../controllers/orderController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route("/create").post(verifyUserAuth, createNewOrder);

export default router;
