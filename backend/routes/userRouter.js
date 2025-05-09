import expresss from "express";
import { userLogin, userRegister } from "../controllers/userController.js";
const router = expresss.Router();

router.route("/add").post(userRegister);
router.route("/login").post(userLogin);

export default router;
