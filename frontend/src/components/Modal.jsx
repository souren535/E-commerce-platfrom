import React, { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Close } from "@mui/icons-material";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  removeErrors,
  removeSuccess,
  updatePassword,
} from "../features/User/userSlice";

const Modal = ({ onClose, modalType }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationMsg, setValidationMsg] = useState({
    oldMatch: "",
    confirmMatch: "",
  });
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const { success, error, message, loading } = useSelector(
    (state) => state.user
  );

  // Clear any stale success/error on mount
  useEffect(() => {
    dispatch(removeErrors());
    dispatch(removeSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (oldPassword && newPassword && oldPassword === newPassword) {
      setValidationMsg((prev) => ({
        ...prev,
        oldMatch: "New password must be different from old password.",
      }));
    } else {
      setValidationMsg((prev) => ({ ...prev, oldMatch: "" }));
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setValidationMsg((prev) => ({
        ...prev,
        confirmMatch: "Passwords should be match.",
      }));
    } else if (newPassword && confirmPassword) {
      setValidationMsg((prev) => ({
        ...prev,
        confirmMatch: "Passwords match ✅",
      }));
    } else {
      setValidationMsg((prev) => ({ ...prev, confirmMatch: "" }));
    }
  }, [confirmPassword, newPassword, oldPassword]);

  const updateSubmit = () => {
    try {
      if (oldPassword !== newPassword) {
        const passwordData = {
          oldPassword,
          newPassword,
          confirmPassword,
        };
        dispatch(updatePassword(passwordData));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (modalType === "update" && success) {
      setTimeout(() => {
        dispatch(removeSuccess());
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 3000);
    }
  }, [success, dispatch, onClose, modalType]);

  useEffect(() => {
    if (modalType === "forgot" && success) {
      const timer = setTimeout(() => {
        dispatch(removeSuccess());
        setEmail("");
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, onClose, modalType]);

  useEffect(() => {
    if (modalType === "update" && error) {
      const timeout = setTimeout(() => {
        dispatch(removeErrors());
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error, dispatch, modalType]);

  useEffect(() => {
    if (modalType === "forgot" && error) {
      const timeout = setTimeout(() => {
        dispatch(removeErrors());
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error, dispatch, modalType]);

  const backDrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modal = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: "-50%",
      x: "-50%",
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: "-50%",
      x: "-50%",
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: "-50%",
      x: "-50%",
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <AnimatePresence>
        {modalType === "update" && (
          <motion.div
            variants={backDrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          >
            <motion.div
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl w-[90%] max-w-md absolute top-1/2 left-1/2"
            >
              <button
                onClick={onClose}
                className="absolute top-2 right-3 text-zinc-600 p-1 hover:text-black rounded-full hover:bg-zinc-300 transition-colors"
              >
                <Close />
              </button>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Update Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Input
                      className="py-6 mb-6"
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <Input
                      className="py-6 mb-6"
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {validationMsg.oldMatch && (
                      <p className="mb-2 text-sm text-red-400">
                        {validationMsg.oldMatch}
                      </p>
                    )}
                    <Input
                      className="py-6 mb-6"
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {validationMsg.confirmMatch && (
                      <p
                        className={`mb-2 text-sm ${
                          validationMsg.confirmMatch.includes("should")
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {validationMsg.confirmMatch}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col justify-center items-center">
                  {error && (
                    <p className="text-red-500 text-sm text-center mb-2">
                      {error.message || "Something went wrong."}
                    </p>
                  )}
                  {success && (
                    <p className="text-green-500 text-sm text-center mb-2">
                      Password updated successfully!
                    </p>
                  )}
                  <Button
                    disabled={
                      !oldPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      validationMsg.oldMatch ||
                      newPassword !== confirmPassword
                    }
                    onClick={updateSubmit}
                    className="mt-3 text-center w-full p-7 rounded-lg text-lg bg-zinc-600 hover:bg-zinc-900"
                  >
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
        {modalType === "forgot" && (
          <motion.div
            variants={backDrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          >
            <motion.div
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl w-[90%] max-w-md absolute top-1/2 left-1/2"
            >
              <button
                onClick={onClose}
                className="absolute top-2 right-3 text-zinc-600 p-1 hover:text-black rounded-full hover:bg-zinc-300 transition-colors"
              >
                <Close />
              </button>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Forget Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Input
                      className="py-6 mb-6"
                      type="email"
                      name="email"
                      placeholder="Enter your ragistration Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col justify-center items-center">
                  {error && (
                    <p className="text-red-500 text-sm text-center mb-2">
                      {error.message || "Something went wrong."}
                    </p>
                  )}
                  {success && (
                    <p className="text-green-500 text-sm text-center mb-2">
                      {message || `Email sent to ${email} successfully!`}
                    </p>
                  )}
                  <Button
                    onClick={handleForgotEmailSubmit}
                    className="mt-3 text-center w-full p-7 rounded-lg text-lg bg-zinc-600 hover:bg-zinc-900"
                  >
                    {loading ? "Sending..." : "Send"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
