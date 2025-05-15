import expresss from "express";
import {
  requestPasswordReset,
  resetPassword,
  updatePassword,
  updateProfile,
  userDetails,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";
const router = expresss.Router();

router.route("/add").post(userRegister);
router.route("/login").post(userLogin);
router.route("/profile").post(verifyUserAuth, userDetails);
router.route("/logout").post(verifyUserAuth, userLogout);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);
router.route("/password/update").post(verifyUserAuth, updatePassword);
router.route("/profile/update").post(verifyUserAuth, updateProfile);

export default router;
