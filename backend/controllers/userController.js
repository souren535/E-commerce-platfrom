import handleAsyncError from "../middleware/handleAsyncError.js";
import { registerValidation, userModel } from "../models/userModel.js";
import HandleEror from "../utils/handleError.js";
import JoiValidation from "../utils/joivalidation.js";
import bcrypt from "bcrypt";

export const userRegister = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, registerValidation).validator();
    let { name, email, password } = req.body;
    const result = await userModel.findOne({ email: email });
    if (result) return next(new HandleEror("user already exists", 409));
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async function (err, result) {
        if (result) {
          const user = await userModel.create({
            name,
            email,
            password: result,
            avatar: {
              public_id: "This is testing id",
              url: "https://example.com/temp-avatar.jpg",
            },
          });
          if (user) {
            res.status(201).json({
              success: true,
              message: `${user.name} registered successfully`,
              user,
            });
          }
        }
      });
    });
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});
