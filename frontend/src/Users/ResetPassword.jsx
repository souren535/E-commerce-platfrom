import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import resetAnimation from "../assets/animations/reset_password.json";
import Lottie from "lottie-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeErrors,
  removeSuccess,
  resetPassword,
} from "../features/User/userSlice";
import Loader from "../components/Loader";
import { toast } from "sonner";
import PageTitle from "../components/PageTitle";
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState({
    confirmMatch: "",
    empty: "",
  });
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeSuccess());
    dispatch(removeErrors());
  }, [dispatch]);

  useEffect(() => {
    const passwordRequirements =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Check if new password is empty but confirm password is filled
    if (!newPassword && confirmPassword) {
      setValidation((prev) => ({
        ...prev,
        empty: "First enter the new password",
        confirmMatch: "",
      }));
      return;
    } else {
      setValidation((prev) => ({
        ...prev,
        empty: "",
      }));
    }

    // Validate password strength
    if (newPassword && !passwordRequirements.test(newPassword)) {
      setValidation((prev) => ({
        ...prev,
        confirmMatch:
          "Password must contain upper, lower, number, symbol, and be 8+ characters.",
      }));
      return;
    }

    // Check if passwords match
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setValidation((prev) => ({
        ...prev,
        confirmMatch: "Passwords do not match.",
      }));
    } else {
      setValidation((prev) => ({
        ...prev,
        confirmMatch: "",
      }));
    }
  }, [newPassword, confirmPassword]);

  const handleResetpasswordSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const userData = {
      newPassword,
    };
    dispatch(resetPassword({ token, userData }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (success) {
      toast.success("Password reset successfully");
      dispatch(removeSuccess());
      navigate("/auth");
    }
  }, [success, dispatch, mounted, navigate]);

  useEffect(() => {
    if (!mounted || !submitted) return;
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Reset password token is invalid or has been expired"
      );
      dispatch(removeErrors());
    }
  }, [error, dispatch, mounted, submitted]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Reset password Page"} />
          <div className="w-[100vw] h-[100vh] flex justify-center items-center">
            <div className="grid xl:grid-cols-2 w-[60vw] h-[60vh] justify-between bg-white border-2 border-white rounded-2xl shadow-lg">
              <div className="Input flex w-full h-full items-center justify-center">
                <div className="w-3/4 max-w-md">
                  <Tabs className="w-full mt-10" defaultValue="Reset_Password">
                    <TabsList className="bg-transparent rounded-none w-full">
                      <TabsTrigger
                        value="Reset_Password"
                        className="data-[state=active]:bg-transparent text-black text-2xl text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-zinc-100 p-3 transition-all duration-300 ease-in-out"
                      >
                        Reset Password
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      className="flex mt-10 flex-col gap-5"
                      value="Reset_Password"
                    >
                      <Input
                        type="password"
                        placeholder="New Password"
                        className="rounded-full p-6 placeholder:text-zinc-700"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      {validation.empty && (
                        <p className="text-sm text-red-400 font-semibold ">
                          {validation.empty}
                        </p>
                      )}
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="rounded-full p-6 placeholder:text-zinc-700"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {validation.confirmMatch && (
                        <p className="text-sm text-red-400 font-semibold ">
                          {validation.confirmMatch}
                        </p>
                      )}

                      <Button
                        className="w-full font-bold rounded-full"
                        disabled={
                          !newPassword ||
                          !confirmPassword ||
                          validation.empty ||
                          validation.confirmMatch
                        }
                        onClick={handleResetpasswordSubmit}
                      >
                        Reset Password
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="w-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 justify-center items-center flex">
                  <Lottie animationData={resetAnimation} loop={true} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;
