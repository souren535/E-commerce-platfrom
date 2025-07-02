import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Clock } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader";
import {
  getAllOrder,
  removeError,
  removeSuccess,
} from "../features/order/orderSlice";
import { toast } from "sonner";
import moment from "moment";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, message, success, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrder());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(message, { id: "order-error" });
      dispatch(removeError());
    }
  }, [error, success, message, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message, { id: "order-success" });
      dispatch(removeSuccess());
    }
  }, [dispatch, success, message]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-zinc-950 text-white py-10 px-4 md:px-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mt-20 mb-2">My Orders</h1>
            <p className="text-zinc-400 mb-8">
              View your recent orders, track statuses, and reorder items.
            </p>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {Array.isArray(orders) &&
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 hover:border-zinc-700 transition"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                          <p className="text-sm text-zinc-400">Order ID</p>
                          <p className="text-lg font-semibold">{order._id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Placed On</p>
                          <p>
                            {moment(order.createdAt).format(
                              "MMMM Do YYYY, h:mm A"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.orderStatus === "Delivered" ? (
                            <BadgeCheck className="text-green-400" size={18} />
                          ) : (
                            <Clock className="text-yellow-400" size={18} />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              order.orderStatus === "Delivered"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-zinc-800 pt-4 grid gap-2">
                        <p className="text-sm text-zinc-400">Items:</p>
                        {order.orderItems?.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between text-sm bg-zinc-800 rounded-lg px-4 py-2"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p>{item.name}</p>
                                <p className="text-zinc-400 text-xs">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-white font-medium">
                              ₹{item.price}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 border-t border-zinc-800 pt-4 grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Items Total:</span>
                          <span>₹{order.itemPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Shipping:</span>
                          <span>₹{order.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2">
                          <span>Total Paid:</span>
                          <span>₹{order.totalPrice}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-zinc-400">
                          Payment:{" "}
                          <span
                            className={`font-medium ${
                              order.paymentInfo?.status === "succeeded"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {order.paymentInfo?.status || "Not Paid"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/10 bg-zinc-800"
                        >
                          <Link to={`/order/${order._id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <h1 className="text-center text-2xl">No data found</h1>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
