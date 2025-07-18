import { Add } from "@mui/icons-material";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { colorOptions, getColors } from "../lib/utils";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import {
  removeErrors,
  removeSuccess,
  updateProfile,
} from "../features/User/userSlice";
import Loader from "../components/Loader";

const UpdateProfile = () => {
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/profile_avatar.png"
  );
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);

  const { user, message, loading, success, error } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  useEffect(() => {
    dispatch(removeSuccess());
    dispatch(removeErrors());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "/images/profile_avatar.png");

      const userColorIndex = colorOptions.findIndex((c) => c.bg === user.color);
      setSelectedColor(userColorIndex !== -1 ? userColorIndex : 0);
    }
  }, [user]);

  useEffect(() => {
    if (error) toast.error(error.message);
    dispatch(removeErrors());
  }, [error, dispatch]);

  useEffect(() => {
    if (success && message) {
      toast.success(message || "Profile update successfully");
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [success, message, dispatch, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.onerror = () => toast.error("Error reading file");
      reader.readAsDataURL(file);
    }
  };

  const updateSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      color: colorOptions[selectedColor].bg,
      avatar,
    };
    dispatch(updateProfile(payload));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center bg-zinc-950 justify-center w-full min-h-screen px-4 py-10">
            <div className="shadow-xl bg-zinc-900 text-white flex justify-center items-center w-[50vw] min-h-[50vh] border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 ">
              <form onSubmit={updateSubmit} encType="multipart/form-data">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-10">
                  Update Profile
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div
                      className="relative h-32 w-32 flex items-center border-2 border-zinc-500 justify-center rounded-full overflow-hidden group cursor-pointer"
                      onClick={() => fileRef.current.click()}
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          className="uppercase h-full w-full flex items-center justify-center text-5xl font-bold"
                          style={{
                            backgroundColor: getColors(selectedColor).bg,
                            color: getColors(selectedColor).text,
                          }}
                        >
                          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Add className="w-10 h-10" />
                      </div>
                      <input
                        ref={fileRef}
                        type="file"
                        name="avatar"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </div>

                    <div className="flex gap-3 flex-wrap justify-center">
                      {colorOptions.map((color, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-300${
                            selectedColor === index
                              ? " border-4 border-white/90"
                              : " border-4 border-zinc-600"
                          }`}
                          style={{ backgroundColor: color.bg }}
                          onClick={() => setSelectedColor(index)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 w-full">
                    <div>
                      <Label className="block mb-1 text-sm font-medium tracking-wide">
                        Name
                      </Label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border-1 border-zinc-500 rounded-md focus:outline-none "
                      />
                    </div>

                    <div>
                      <Label className="block mb-1 text-sm font-medium tracking-wide">
                        Email
                      </Label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border-1 border-zinc-500 rounded-md focus:outline-none "
                      />
                    </div>
                  </div>
                </div>
                <button className="mt-15 bg-zinc-800 cursor-pointer text-white hover:font-semibold px-6 py-2 rounded-xl w-full transition-transform duration-300 ease-in-out hover:translate-y-1">
                  {loading ? "Save Changes...." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProfile;
