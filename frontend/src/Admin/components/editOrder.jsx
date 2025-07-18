import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import withRoleAccess from "@/Security/withRoleAccess";
import { useDispatch, useSelector } from "react-redux";
import {
  AdminUpdateOrderStatus,
  getAdminOrderDetails,
  removeErrors,
  removeSuccess,
} from "@/features/Admin/adminSlice";

const EditOrder = () => {
  const [status, setStatus] = useState("");
  const { order, loading, error, success } = useSelector(
    (state) => state.admin
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { orderId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeSuccess("update"));
    if (orderId) {
      dispatch(getAdminOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const handleUpdate = (orderId) => {
    setHasSubmitted(true);
    dispatch(AdminUpdateOrderStatus({ orderId, status }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success?.update && hasSubmitted) {
      toast.success(`order status change to ${status}`);
      dispatch(removeSuccess("update"));
      setHasSubmitted(false);
    }
  }, [error, success, dispatch, status, hasSubmitted]);

  const paymentStatus =
    order?.paymentInfo?.status === "succeeded" ? "Paid" : "Not Paid";
  const finalStatus =
    paymentStatus === "Not Paid" ? "Cancelled" : order?.orderStatus;

  return (
    <div className="min-h-screen bg-zinc-950 text-white mt-20 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-zinc-900 p-8 rounded-xl border border-indigo-700 shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-indigo-400">
          Update Order Status: <span className="text-white">{order._id}</span>
        </h1>

        {/* Customer Info */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">
            Customer Info
          </h2>
          <p className="text-sm md:text-base">Name : {order?.user?.name}</p>
          <p className="text-sm md:text-base">Email : {order?.user?.email}</p>
          <p className="text-sm md:text-base">
            Email : {order?.shippingInfo?.phoneNo}
          </p>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">Items</h2>
          <ul className="space-y-4">
            {order?.orderItems?.map((item, i) => (
              <li key={i} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover border border-zinc-700"
                />
                <div>
                  <p className="text-white font-medium">
                    {item.quantity} × {item.name}
                  </p>
                  <p className="text-sm text-zinc-400">₹{item.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Total Price */}
        <div>
          <p className="text-lg font-medium text-zinc-300">
            Total Price:{" "}
            <span className="text-white font-semibold">
              ₹{order?.totalPrice?.toFixed(2)}
            </span>
          </p>
          <p className="text-lg font-medium text-zinc-300">
            Payment Status:{" "}
            <span className="text-white font-semibold">{paymentStatus}</span>
          </p>
          <p className="text-lg font-medium text-zinc-300">
            Order Status:{" "}
            <span className="text-white font-semibold">{finalStatus}</span>
          </p>
        </div>

        {/* Status Select */}
        <div>
          <label
            htmlFor="status"
            className="block mb-2 font-medium text-zinc-300"
          >
            Update Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full cursor-pointer bg-zinc-800 text-white p-3 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            disabled={!status || finalStatus === "Delivered"}
            onClick={() => handleUpdate(order._id)}
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
          >
            {loading ? "updating status..." : "Update Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProtectedOrderEdit = withRoleAccess(EditOrder);
export default ProtectedOrderEdit;
