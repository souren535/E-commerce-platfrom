import React, { useEffect } from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { Edit3Icon, Search, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  AdminDeleteUser,
  clearMessage,
  fetchAllUser,
  removeErrors,
  removeSuccess,
} from "../features/Admin/adminSlice";
import Loader from "../components/Loader";
import moment from "moment";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const AllUsers = () => {
  const { users, loading, error, success, message } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear any leftover messages when the page loads
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllUser());

    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handleDeleteUser = (userId) => {
    dispatch(AdminDeleteUser(userId));
  };

  useEffect(() => {
    if (success?.delete) {
      toast.success("User deleted successfully");
      dispatch(removeSuccess("delete"));
    }

    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    // Only redirect if the message is about user deletion
    if (message && message.toLowerCase().includes("user")) {
      toast.success(message);
      dispatch(clearMessage());
      navigate("/admin/dashboard");
    }
  }, [dispatch, success, error, message, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-zinc-950 text-white px-6 mt-20 py-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-indigo-400">All Users</h1>
          </div>

          <div className="overflow-x-auto rounded-lg shadow border border-indigo-800">
            <table className="min-w-full text-sm text-left bg-zinc-900">
              <thead className="text-sm uppercase bg-zinc-800 text-indigo-300 border-b border-indigo-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-base text-zinc-300">
                {users.map((user, i) => (
                  <tr
                    key={user._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800 transition"
                  >
                    <td className="px-6 py-4 font-medium">{i + 1}</td>
                    <td className="px-6 py-4 uppercase">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      {moment(user.createdAt).format("MMMM Do YYYY, h:mm A")}
                    </td>
                    <td className="px-8 py-6 flex justify-end items-center gap-5 text-sm">
                      {user.role?.toLowerCase() !== "admin" && (
                        <>
                          <Link
                            to={`/admin/user/edit/${user._id}`}
                            className="text-indigo-400 hover:text-indigo-200"
                          >
                            <Edit3Icon size={25} />
                          </Link>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-500 hover:text-red-300 cursor-pointer"
                          >
                            <Trash size={25} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

const ProtectedAllUsers = withRoleAccess(AllUsers);

export default ProtectedAllUsers;
