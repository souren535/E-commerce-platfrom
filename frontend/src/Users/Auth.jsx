import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import Lottie from "lottie-react";
import CircleSignupLoading from "../assets/animations/Loading_Circle_signUp.json";
import {
  login,
  removeErrors,
  removeSuccess,
  signup,
} from "../features/User/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Modal from "../components/Modal";
import PageTitle from "../components/PageTitle";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "./images/profile_avatar.png"
  );
  const [hovered, setHovered] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const fileRef = useRef(null);
  const { success, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const [authType, setAuthType] = useState("");

  const dispatch = useDispatch();

  // Clear any existing errors immediately when component mounts
  useEffect(() => {
    dispatch(removeErrors());
  }, [dispatch]);

  // Clear any existing errors when component mounts
  useEffect(() => {
    if (error) {
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Handle authentication errors only when user actively tries to login/signup
  useEffect(() => {
    if (error && authType && !openModal) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong. Please try again later";
      toast.error(
        authType === "signup"
          ? `${errorMessage}`
          : `Login Failed - ${errorMessage}`
      );
      dispatch(removeErrors());
      setAuthType("");
    }
  }, [authType, dispatch, error, openModal]);

  useEffect(() => {
    if (success && authType) {
      toast.success(
        authType === "signup"
          ? "Signup successful!"
          : "Login successful! Welcome back!"
      );
      dispatch(removeSuccess());
      navigate("/");
      if (authType === "login") {
        setLoginData({
          email: "",
          password: "",
        });
      }
      setAuthType("");
    }
  }, [success, authType, dispatch, navigate]);

  const handleOpenModal = () => {
    dispatch(removeErrors());
    dispatch(removeSuccess());
    setOpenModal(true);
  };
  const closeModal = () => setOpenModal(false);
  useEffect(() => {
    if (authType === "login" && isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        navigate(redirect);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authType, isAuthenticated, navigate, redirect]);

  // Cleanup effect to clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch]);

  const handleFileInputClick = () => {
    fileRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result); // for preview
          setAvatar(reader.result); // for upload (base64 string)
        }
      };
      reader.onerror = () => toast.error("Error reading file");
      reader.readAsDataURL(file);
    }
  };

  const validateLogin = () => {
    if (!loginData.email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!loginData.password.length) {
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
    if (!confirmPassword.length) {
      toast.error("Confirm password is required");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error("Password must contain at least one special character");
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
      setAuthType("login");
      setIsLoading(true);
      dispatch(login(loginData));
    }
  };
  const handleSignup = () => {
    if (validateSignup()) {
      const userData = {
        name,
        email,
        password,
        avatar, // base64 string
      };
      dispatch(signup(userData));
      setAuthType("signup");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAvatar(null);
      setAvatarPreview("./images/profile_avatar.png");
    }
  };
  return (
    <>
      <PageTitle title={`Auth Page`} />
      <div className="flex bg-zinc-950 items-center justify-center w-[100vw] min-h-[100vh] p-4">
        <div className="flex flex-col md:flex-row items-center justify-center shadow-lg w-full max-w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] min-h-[90vh] md:h-[70vh] bg-zinc-900 border-2 border-zinc-800 rounded-3xl overflow-hidden">
          <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 backdrop:blur-xl shadow-lg rounded-3xl p-4 md:p-3 lg:p-3 xl:p-5 items-center justify-center flex">
            <div className="login signup tabs flex flex-col items-center justify-center w-full min-h-full">
              <h1 className="text-zinc-500 hover:text-white font-bold text-xl md:text-xl lg:text-4xl tracking-wider mb-6 md:mb-0 md:mt-10">
                Sign in/Sign up
              </h1>
              <Tabs
                className="w-full md:w-3/4 mt-4 md:mt-10"
                defaultValue="signin"
              >
                <TabsList className="bg-transparent rounded-none w-full ">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-transparent text-zinc-500 hover:text-white border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:border-b-zinc-600 p-3 transition-all duration-300 ease-in-out "
                  >
                    Sign in
                  </TabsTrigger>
                  <TabsTrigger
                    value="Signup"
                    className="data-[state=active]:bg-transparent text-zinc-500 hover:text-white border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:border-b-zinc-600 p-3 transition-all duration-300 ease-in-out "
                  >
                    Sign up
                  </TabsTrigger>
                </TabsList>

                {/* Login content */}
                <TabsContent
                  className="flex mt-6 md:mt-10 flex-col gap-4 md:gap-5"
                  value="signin"
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="rounded-full p-4 md:p-6 placeholder:text-zinc-400 hover:placeholder:text-white text-white bg-zinc-800 border-1 border-zinc-700 text-sm md:text-base"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="rounded-full p-4 md:p-6 placeholder:text-zinc-400 hover:placeholder:text-white text-white bg-zinc-800 border-1 border-zinc-700 text-sm md:text-base"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                  />

                  <Button
                    className="w-full bg-zinc-800 border-1 cursor-pointer border-zinc-700 hover:bg-zinc-800 transform transition-all duration-300 ease-in-out hover:translate-y-1 font-bold rounded-full p-4 md:p-6 text-sm md:text-base"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        Signing In...
                        <span className="w-5 h-5 md:w-6 md:h-6">
                          <Lottie
                            animationData={CircleSignupLoading}
                            loop={true}
                          />
                        </span>
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                  <p className="font-light text-center text-xs md:text-sm text-white">
                    <span>Forget your Password? </span>
                    <span
                      onClick={handleOpenModal}
                      className="text-blue-500 hover:text-blue-600 hover:text-lg cursor-pointer"
                    >
                      Reset Here
                    </span>
                  </p>
                  {openModal && (
                    <Modal onClose={closeModal} modalType={"forgot"} />
                  )}
                </TabsContent>

                {/* signup content */}
                <TabsContent
                  className="flex mt-6 md:mt-10 flex-col gap-4 md:gap-5"
                  value="Signup"
                >
                  <div className="relative flex justify-center items-center mb-2">
                    {/* Avatar */}
                    <div
                      className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-1 border-zinc-700 hover:border-zinc-600 bg-zinc-800 shadow-lg"
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    >
                      <Avatar className="w-full h-full rounded-full overflow-hidden">
                        <AvatarImage
                          src={avatarPreview}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      </Avatar>

                      {/* Hover Overlay */}
                      {hovered && (
                        <div
                          className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center rounded-full cursor-pointer"
                          onClick={handleFileInputClick}
                        >
                          <Add className="text-white text-xl md:text-3xl" />
                        </div>
                      )}
                    </div>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      name="avatar"
                      accept=".png, .jpg, .jpeg, .svg, .webp"
                      ref={fileRef}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  <Input
                    type="text"
                    placeholder="Name"
                    name="name"
                    className="rounded-full p-4 md:p-6 text-white placeholder:text-zinc-400 hover:placeholder:text-white bg-zinc-800 border-1 border-zinc-700 text-sm md:text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Input
                    type="email"
                    placeholder="email"
                    name="email"
                    className="rounded-full p-4 md:p-6 placeholder:text-zinc-400 text-white hover:placeholder:text-white bg-zinc-800 border-1 border-zinc-700 text-sm md:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="password"
                    name="password"
                    className="rounded-full p-4 md:p-6 placeholder:text-zinc-400 text-white hover:placeholder:text-white bg-zinc-800 border-1 border-zinc-700 text-sm md:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Input
                    type="password"
                    placeholder="Confirm password"
                    className="rounded-full p-4 md:p-6 placeholder:text-zinc-400 text-white hover:placeholder:text-white bg-zinc-800 border-1 border-zinc-700 text-sm md:text-base"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <Button
                    className="w-full bg-zinc-800 border-1 cursor-pointer border-zinc-700 hover:bg-zinc-900 transform transition-all duration-300 ease-in-out hover:translate-y-1 font-bold rounded-full p-4 md:p-6 text-sm md:text-base"
                    onClick={handleSignup}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        Signing Up...
                        <span className="w-5 h-5 md:w-6 md:h-6">
                          <Lottie
                            animationData={CircleSignupLoading}
                            loop={true}
                          />
                        </span>
                      </span>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Mobile Welcome Message */}
          <div className="md:hidden flex items-center justify-center w-full p-4 mb-4">
            <h1 className="text-center text-white">
              <span className="text-lg text-zinc-500 hover:text-white font-semibold">
                Welcome to{" "}
                <span className="text-blue-500 font-['COMIC_SANS_MS']">
                  ShopEazy
                </span>
                <span>
                  {" "}
                  <motion.img
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: [0, -5, 5, -5, 5, 0],
                    }}
                    transition={{
                      opacity: { duration: 1 },
                      rotate: {
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                      },
                    }}
                    whileHover={{ scale: 1.2 }}
                    src="/images/shopping-bag-icon-by-Vexels.svg"
                    alt="icon"
                    className="inline-block w-6 h-6 ml-1"
                  />
                </span>
              </span>
            </h1>
          </div>

          {/* Desktop Welcome Message */}
          <div className="hidden md:flex items-center justify-center w-full h-full p-3">
            <h1 className="flex items-center md:text-4xl lg:text-5xl xl:text-6xl text-3xl justify-center w-full h-full text-white rounded-3xl ">
              <span className="text-3xl text-zinc-500 hover:text-white md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center">
                Welcome to the{" "}
                <span className="text-blue-500 font-['COMIC_SANS_MS'] ">
                  ShopEazy
                </span>
                <span>
                  {" "}
                  <motion.img
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: [0, -5, 5, -5, 5, 0],
                    }}
                    transition={{
                      opacity: { duration: 1 },
                      rotate: {
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                      },
                    }}
                    whileHover={{ scale: 1.2 }}
                    src="/images/shopping-bag-icon-by-Vexels.svg"
                    alt="icon"
                    className="inline-block w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 ml-2"
                  />
                </span>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
