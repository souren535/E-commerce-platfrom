import React, { useEffect } from "react";
import withRoleAccess from "../Security/withRoleAccess";
import { Button } from "../components/ui/button";
import { Edit3Icon, Search, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  AdminDeleteOrder,
  getAllOrders,
  removeErrors,
  removeSuccess,
} from "../features/Admin/adminSlice";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Loader from "../components/Loader";

const AllOrders = () => {
  const { orders, loading, message, success, error } = useSelector(
    (state) => state.admin
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleDelerteOrder = (oredrId) => {
    dispatch(AdminDeleteOrder(oredrId));
  };

  useEffect(() => {
    if (success?.delete) {
      toast.success(message);
      dispatch(removeSuccess("delete"));
    }
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, message, error, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-zinc-950 text-white px-2 sm:px-4 md:px-6 py-6 md:py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 mt-10 sm:mt-20 gap-2 sm:gap-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-400">
              All Orders
            </h1>
            {/* Search input can be made responsive if enabled */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full rounded-lg shadow border border-indigo-800">
            <table className="min-w-[600px] w-full text-xs sm:text-sm text-left bg-zinc-900">
              <thead className="text-xs uppercase bg-zinc-800 text-indigo-300 border-b border-indigo-700">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3">#</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3">Order ID</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3">Status</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3">Total Price</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3">Number of Items</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {orders.map((order, i) => (
                  <tr
                    key={order._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800 transition"
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-4 font-medium">{i + 1}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{order._id}</td>
                    <td
                      className={`px-2 sm:px-4 py-2 sm:py-4 ${
                        order.orderStatus === "Processing"
                          ? "text-yellow-500"
                          : order.orderStatus === "Cancelled"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {order.orderStatus}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{order.totalPrice.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">{order.orderItems.length}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                      <div className="flex justify-end items-center space-x-2 sm:space-x-4">
                        <Link
                          to={`/admin/order/edit/${order._id}`}
                          className="text-indigo-400 hover:text-indigo-200"
                        >
                          <Edit3Icon size={20} className="sm:w-6 sm:h-6" />
                        </Link>
                        <button
                          onClick={() => handleDelerteOrder(order._id)}
                          className="text-red-500 hover:text-red-300 cursor-pointer"
                        >
                          <Trash size={20} className="sm:w-6 sm:h-6" />
                        </button>
                      </div>
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

const ProtectedAllOrders = withRoleAccess(AllOrders);
export default ProtectedAllOrders;
