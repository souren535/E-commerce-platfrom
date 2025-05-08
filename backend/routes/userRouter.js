import expresss from "express";
import { userRegister } from "../controllers/userController.js";
const router = expresss.Router();

router.route("/add").post(userRegister);


export default router ;