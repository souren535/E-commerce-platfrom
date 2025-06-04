import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  removeErrors,
  removeSuccess,
  signup,
} from "../features/User/userSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { success, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const [authType, setAuthType] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Somthing went wrong. Please try again later";
      toast.error(
        authType === "signup"
          ? `${errorMessage}`
          : `Login Failed - ${errorMessage}`
      );
      dispatch(removeErrors());
      setAuthType("");
    }
  }, [authType, dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(
        authType === "signup"
          ? "Signup successful! You can now login."
          : "Login successful! Welcome back!"
      );
      dispatch(removeSuccess());
      setAuthType("");
    }
  }, [success, authType, dispatch]);

  useEffect(() => {
    if (authType === "login" && isAuthenticated) {
      navigate("/");
    }
  }, [authType, isAuthenticated, navigate]);

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!name.length) {
      toast.error("Name is required");
      return false;
    }
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords should be match");
      return false;
    }
    return true;
  };
  const handleLogin = () => {
    if (validateLogin()) {
      const userData = {
        email,
        password,
      };
      setAuthType("login");
      dispatch(login(userData));
      setEmail("");
      setPassword("");
    }
  };
  const handleSignup = () => {
    if (validateSignup()) {
      // const myForm = new FormData();
      // myForm.set("name", name);
      // myForm.set("email", email);
      // myForm.set("password", password);
      // console.log(myForm.entries());
      // for (let pair of myForm.entries()) {
      //   console.log(pair[0] + "-" + pair[1]);
      // }
      const userData = {
        name,
        email,
        password,
      };
      setAuthType("signup");
      dispatch(signup(userData));
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center justify-center w-[100vw] h-[100vh] ">
            <div className=" flex flex-nowrap items-center justify-center shadow-lg w-full max-w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-auto md:h-[70vh]   bg-gradient-to-r from-blue-500 to-purple-300 border-t-white border-2 border-white rounded-3xl overflow-hidden">
              <div className=" h-full left-full backdrop:blur-xl shadow-lg w-full md:w-1/2 lg:w-1/2 xl:w-1/2 rounded-3xl md:p-3 lg:p-3 xl:p-5 items-center justify-center p-6 flex">
                <div className="login signup tabs flex flex-col items-center justify-center w-full min-h-full">
                  <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider">
                    Login/Signup
                  </h1>
                  <Tabs className="w-3/4 mt-10" defaultValue="Login">
                    <TabsList className="bg-transparent rounded-none w-full ">
                      <TabsTrigger
                        value="Login"
                        className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-zinc-100 p-3 transition-all duration-300 ease-in-out "
                      >
                        Login
                      </TabsTrigger>
                      <TabsTrigger
                        value="Signup"
                        className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-zinc-100 p-3 transition-all duration-300 ease-in-out "
                      >
                        Signup
                      </TabsTrigger>
                    </TabsList>

                    {/* Login content */}
                    <TabsContent
                      className="flex mt-10 flex-col gap-5"
                      value="Login"
                    >
                      <Input
                        type="email"
                        placeholder="email"
                        className="rounded-full p-6 placeholder:text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="password"
                        className="rounded-full p-6 placeholder:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <Button
                        className="w-full font-bold rounded-full"
                        onClick={handleLogin}
                      >
                        Login
                      </Button>
                    </TabsContent>

                    {/* signup content */}
                    <TabsContent
                      className="flex mt-10 flex-col gap-5"
                      value="Signup"
                    >
                      <Input
                        type="text"
                        placeholder="Name"
                        className="rounded-full p-6 placeholder:text-white "
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />

                      <Input
                        type="email"
                        placeholder="email"
                        className="rounded-full p-6 placeholder:text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="password"
                        className="rounded-full p-6 placeholder:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <Input
                        type="password"
                        placeholder="Confirm password"
                        className="rounded-full p-6 placeholder:text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />

                      <Button
                        className="w-full font-bold rounded-full"
                        onClick={handleSignup}
                      >
                        Signup
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className=" items-center justify-center w-full h-full p-3">
                <h1 className="flex items-center md:text-4xl lg:text-5xl xl:text-6xl text-3xl justify-center w-full h-full text-white rounded-3xl ">
                  <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center">
                    Welcome to the{" "}
                    <span className="text-blue-500 font-['COMIC_SANS_MS'] ">
                      ShopEazy
                    </span>
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Auth;
