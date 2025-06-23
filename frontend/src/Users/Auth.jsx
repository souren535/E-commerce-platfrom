import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import {
  login,
  removeErrors,
  removeSuccess,
  signup,
} from "../features/User/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Add } from "@mui/icons-material";
import Modal from "../components/Modal";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
  const [authType, setAuthType] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (error && !openModal) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Somthing went wrong. Please try again later";
      toast.error(
        authType === "signup"
          ? `${errorMessage}`
          : `Login Failed - ${errorMessage},`
      );
      dispatch(removeErrors());
      setAuthType("");
    }
  }, [authType, dispatch, error, openModal]);

  useEffect(() => {
    if (success && authType) {
      toast.success(
        authType === "signup"
          ? "Signup successful! You can now login."
          : "Login successful! Welcome back!"
      );
      dispatch(removeSuccess());
      setAuthType("");
    }
  }, [success, authType, dispatch]);

  const handleOpenModal = () => {
    dispatch(removeErrors());
    dispatch(removeSuccess());
    setOpenModal(true);
  };
  const closeModal = () => setOpenModal(false);
  useEffect(() => {
    if (authType === "login" && isAuthenticated) {
      navigate("/");
    }
  }, [authType, isAuthenticated, navigate]);

  const handleFileInputClick = () => {
    fileRef.current?.click();
  };

  const handleImageChange = (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        setAvatar(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      // if (avatar instanceof File) {
      //   myForm.append("avatar", avatar);
      // }
      const userData = {
        name,
        email,
        password,
        avatar,
      };
      setAuthType("signup");
      dispatch(signup(userData));
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center justify-center w-[100vw] h-[100vh]">
            <div className=" flex flex-nowrap items-center justify-center shadow-lg w-full max-w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-auto md:h-[70vh] bg-white border-2 border-white rounded-3xl overflow-hidden">
              <div className=" h-full left-full backdrop:blur-xl shadow-lg w-full md:w-1/2 lg:w-1/2 xl:w-1/2 rounded-3xl md:p-3 lg:p-3 xl:p-5 items-center justify-center p-6 flex">
                <div className="login signup tabs flex flex-col items-center justify-center w-full min-h-full">
                  <h1 className="text-zinc-700 font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider">
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
                        className="rounded-full p-6 placeholder:text-zinc-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="password"
                        className="rounded-full p-6 placeholder:text-zinc-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <Button
                        className="w-full font-bold rounded-full"
                        onClick={handleLogin}
                      >
                        Login
                      </Button>
                      <p className="font-light text-center md:text-sm ">
                        <span>Forget your Password? </span>
                        <span
                          onClick={handleOpenModal}
                          className="text-blue-500 cursor-pointer"
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
                      className="flex mt-10 flex-col gap-5"
                      value="Signup"
                    >
                      <div className="relative flex justify-center items-center ">
                        {/* Avatar */}
                        <div
                          className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-1 border-white shadow-lg"
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
                              className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full cursor-pointer"
                              onClick={handleFileInputClick}
                            >
                              <Add className="text-white text-3xl" />
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
                        className="rounded-full p-6 placeholder:text-zinc-700 "
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />

                      <Input
                        type="email"
                        placeholder="email"
                        name="email"
                        className="rounded-full p-6 placeholder:text-zinc-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="password"
                        name="password"
                        className="rounded-full p-6 placeholder:text-zinc-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <Input
                        type="password"
                        placeholder="Confirm password"
                        className="rounded-full p-6 placeholder:text-zinc-700"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />

                      <Button
                        className="w-full font-bold rounded-full"
                        onClick={handleSignup}
                      >
                        {loading ? "Signin Up" : "Signup"}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className=" items-center justify-center w-full h-full p-3">
                <h1 className="flex items-center md:text-4xl lg:text-5xl xl:text-6xl text-3xl justify-center w-full h-full text-white rounded-3xl ">
                  <span className="text-3xl text-zinc-700 md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center">
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
      )}
    </>
  );
};

export default Auth;
