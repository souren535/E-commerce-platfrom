import expresss from "express";
import {
  deleteUser,
  getSingleUser,
  getUserList,
  requestPasswordReset,
  resetPassword,
  updatePassword,
  updateProfile,
  updateRole,
  userDetails,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import { roleBaseAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = expresss.Router();

router.route("/add").post(userRegister);
router.route("/login").post(userLogin);
router.route("/profile").post(verifyUserAuth, userDetails);
router.route("/logout").post(verifyUserAuth, userLogout);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);
router.route("/password/update").put(verifyUserAuth, updatePassword);
router.route("/profile/update").put(verifyUserAuth, updateProfile);

// admin - getting user information
router
  .route("/admin/users")
  .post(verifyUserAuth, roleBaseAccess("admin"), getUserList);

// admin - getting single user information
router
  .route("/admin/user/:id")
  .post(verifyUserAuth, roleBaseAccess("admin"), getSingleUser);

// admin - user role update
router
  .route("/admin/user/update/:id")
  .put(verifyUserAuth, roleBaseAccess("admin"), updateRole);

// admin - user delete
router
  .route("/admin/user/delete/:id")
  .delete(verifyUserAuth, roleBaseAccess("admin"), deleteUser);

export default router;

