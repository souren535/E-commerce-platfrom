import React, { useEffect, useState } from "react";
import withRoleAccess from "../../Security/withRoleAccess";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AdminGetSingleUser,
  removeErrors,
  removeSuccess,
  updateUserRoll,
} from "../../features/Admin/adminSlice";
import { toast } from "sonner";

const EditUser = () => {
  const { userId } = useParams();
  const { user, loading, success, error } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const { name, email, role } = formData;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AdminGetSingleUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserRoll({ userId, role }));
  };

  useEffect(() => {
    if (success?.update) {
      toast.success("user role update successfully");
      dispatch(removeSuccess("update"));
      navigate("/admin/allUsers");
    }

    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [success, dispatch, error, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-white justify-center items-center flex px-6 py-12">
      <div className="max-w-5xl mx-auto bg-zinc-900 border mt-20 border-indigo-700 rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-extrabold text-indigo-400 mb-6">
          Edit User
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Avatar Preview */}
          <div className="flex items-center gap-6">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="User Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div
                className="uppercase w-[140px] h-[140px] text-white rounded-full text-center flex object-cover border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] mx-auto mb-8 justify-center items-center transition-transform duration-300 ease-in-out hover:scale-105 text-6xl font-bold"
                style={{ backgroundColor: user.color }}
              >
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm mb-1 text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              readOnly
              placeholder={name}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-zinc-300">Email</label>
            <input
              type="email"
              readOnly
              placeholder={email}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm mb-1 text-zinc-300">Role</label>
            <select
              value={role}
              name="role"
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white outline-none focus:border-indigo-500"
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              {loading ? "saving...." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProtectedEditUser = withRoleAccess(EditUser);

export default ProtectedEditUser;
