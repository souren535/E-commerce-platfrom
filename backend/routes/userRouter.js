import expresss from "express";
import {
  requestPasswordReset,
  resetPassword,
  userDetails,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";
const router = expresss.Router();

router.route("/add").post(userRegister);
router.route("/login").post(userLogin);
router.route("/list/:id").post(verifyUserAuth, userDetails);
router.route("/logout").post(userLogout);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);

export default router;
