import { Add } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import Footer from "@/components/Footer";
import Modal from "../components/Modal";
import { removeErrors, removeSuccess } from "../features/User/userSlice";

const Profile = () => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const opnenModal = () => {
    dispatch(removeErrors());
    dispatch(removeSuccess());
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !user) {
    return <Loader />;
  }

  const avatarUrl = user?.avatar?.url;
  const isValidAvatar =
    avatarUrl && avatarUrl !== "null" && avatarUrl.trim() !== "";

  return (
    <>
      <div className="w-full h-screen bg-zinc-900 flex justify-center items-center">
        <div className="max-w-[800px] p-8 rounded-xl bg-zinc-800 shadow-lg">
          <PageTitle title={`${user?.name || "User"} Profile`} />
          <div className="text-center rounded-xl mb-10">
            <h1 className="text-4xl text-white m-8 font-semibold tracking-[-0.5px]">
              My Profile
            </h1>

            {isValidAvatar ? (
              <img
                src={avatarUrl}
                alt="profile"
                className="w-[180px] h-[180px] rounded-full object-cover border-4 border-zinc-600 shadow-md mx-auto mb-8 block transition-transform duration-300 ease-in-out hover:scale-105"
              />
            ) : (
              <div
                className="uppercase w-[140px] h-[140px] text-white rounded-full text-center flex object-cover border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] mx-auto mb-8 justify-center items-center transition-transform duration-300 ease-in-out hover:scale-105 text-6xl font-bold"
                style={{ backgroundColor: user.color }}
              >
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            <Link
              to="/profile/update"
              className="inline-block py-1 px-4 bg-zinc-700 text-white rounded-[10px] font-semibold transition-all duration-300 border-2 border-zinc-600 ease-in-out hover:translate-y-1 shadow-2xl"
            >
              Edit Profile
            </Link>
          </div>

          <div className="profile-details p-5 rounded-xl mx-0 my-8">
            <div className="flex items-center p-5 mb-4 bg-zinc-700 border-2 border-zinc-600 rounded-2xl transition-all duration-300 ease-in-out shadow-[8px] hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-[1.1rem] text-white min-w-[130px] font-semibold">
                Username:
              </h2>
              <p className="text-[1.1rem] text-white 100 pl-4 font-semibold">
                {user?.name || "N/A"}
              </p>
            </div>

            <div className="flex items-center p-5 mb-4 bg-zinc-700 border-2 border-zinc-600 rounded-2xl transition-all duration-300 ease-in-out shadow-[8px] hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-[1.1rem] text-white min-w-[130px] font-semibold">
                Email:
              </h2>
              <p className="text-[1.1rem] text-white 100 pl-4 font-semibold">
                {user?.email || "N/A"}
              </p>
            </div>

            <div className="flex items-center p-5 mb-4 bg-zinc-700 border-2 border-zinc-600 rounded-2xl transition-all duration-300 ease-in-out shadow-[8px] hover:translate-x-1 hover:shadow-2xl">
              <h2 className="text-[1.1rem] text-white min-w-[130px] font-semibold">
                Joined On:
              </h2>
              <p className="text-[1.1rem] text-white bg-zinc-700 pl-4 font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="profile-button flex gap-4 justify-center mt-9">
            <Link className="py-1 px-4 bg-zinc-700 text-white border-2 border-zinc-600 rounded-[10px] font-semibold transition-all duration-300 ease-in-out shadow-[12px] hover:bg-zinc-700 hover:translate-y-1">
              My Orders
            </Link>
            <button
              onClick={opnenModal}
              className="py-1 px-4 bg-zinc-700 text-white border-2 border-zinc-600 rounded-[10px] font-semibold transition-all duration-300 ease-in-out shadow-[12px] hover:bg-zinc-700 hover:translate-y-1"
            >
              Change Password
            </button>
            {isOpen && <Modal onClose={closeModal} modalType={"update"} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
