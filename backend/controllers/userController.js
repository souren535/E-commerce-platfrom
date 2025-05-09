import handleAsyncError from "../middleware/handleAsyncError.js";
import {
  loginValidation,
  registerValidation,
  userModel,
} from "../models/userModel.js";
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
      bcrypt.hash(password, salt, async function (err, hash) {
        if (hash) {
          const user = await userModel.create({
            name,
            email,
            password: hash,
            avatar: {
              public_id: "This is testing id",
              url: "https://example.com/temp-avatar.jpg",
            },
          });
          let token = user.getJWTToken();
          if (user) {
            res.status(201).json({
              success: true,
              message: `${user.name} you are registered successfully`,
              user,
              token,
            });
          }
        }
      });
    });
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});

export const userLogin = handleAsyncError(async (req, res, next) => {
  try {
    new JoiValidation(req.body, loginValidation).validator();
    let { email, password } = req.body;
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");
    if (!user) return next(new HandleEror("invalid email or password", 400));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new HandleEror("invalid email or password", 400));

    const token = user.getJWTToken();

    res.status(200).json({
      success: true,
      message: `${user.email} logged in successfully`,
      token,
    });
  } catch (error) {
    return next(new HandleEror(error.message, 500));
  }
});
