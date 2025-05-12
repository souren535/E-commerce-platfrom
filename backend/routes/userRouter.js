import expresss from "express";
import {
  requestPasswordReset,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
const router = expresss.Router();

router.route("/add").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/password/forget").post(requestPasswordReset);


export default router;
