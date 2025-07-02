import React, { useEffect } from "react";
import { BadgeCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, removeError } from "../features/order/orderSlice";
import { toast } from "sonner";
import Loader from "../components/Loader";
import moment from "moment";
const OrderDetails = () => {
  const { id } = useParams();
  console.log("order id", id);

  const { loading, order, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  console.log("order Details", order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Something went wrong"
      );
      dispatch(removeError());
    }
  }, [error, dispatch]);

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    taxPrice,
    shippingPrice,
    itemPrice,
    paidAt,
  } = order;

  const paymentStatus =
    paymentInfo.status === "succeeded" ? "paid" : "Not paid";
  const finalOrderStatus =
    paymentStatus === "Not paid" ? "Cancelled" : orderStatus;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-zinc-950 text-white py-10 px-4 md:px-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mt-16">Order Details</h1>

            {/* Order Meta Info */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-3">
              <p className="text-sm text-zinc-400">Order ID:</p>
              <p className="text-lg font-medium">{id}</p>

              <div className="flex items-center gap-2">
                {finalOrderStatus === "Delivered" ? (
                  <BadgeCheck className="text-green-400" size={18} />
                ) : (
                  <Clock className="text-yellow-400" size={18} />
                )}
                <span
                  className={`text-sm font-medium ${
                    orderStatus === "Delivered"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {finalOrderStatus}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-semibold mb-4">Items</h2>
              {orderItems.map((item) => (
                <div className="space-y-4">
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-zinc-800 p-4 rounded-xl"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-zinc-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-3">
              <h2 className="text-xl font-semibold">Shipping Info</h2>
              <p>
                <span className="text-zinc-400">Phone:</span>{" "}
                {shippingInfo.phoneNo}
              </p>
              <p>
                <span className="text-zinc-400">Address:</span>{" "}
                {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pinCode}, ${shippingInfo.country}`}
              </p>
            </div>

            {/* Payment Info */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-3">
              <h2 className="text-xl font-semibold">Payment Info</h2>
              <p>
                <span className="text-zinc-400">Payment ID:</span>{" "}
                {paymentInfo.id}
              </p>
              <p>
                <span className="text-zinc-400">PaidAt:</span>{" "}
                {moment(paidAt).format("MMMM Do YYYY, h:mm A")}
              </p>
              <p>
                <span className="text-zinc-400">Status:</span>{" "}
                <span
                  className={
                    paymentStatus === "paid" ? "text-green-400" : "text-red-400"
                  }
                >
                  {paymentStatus}
                </span>
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-3 text-sm">
              <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
              <div className="flex justify-between">
                <span className="text-zinc-400">Items:</span>
                <span>₹{itemPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tax:</span>
                <span>₹{taxPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Shipping:</span>
                <span>₹{shippingPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-zinc-800 pt-2 mt-2">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            {/* <div className="text-center mt-10">
              <Button className="bg-green-500 hover:bg-green-600 transition rounded-xl text-white font-semibold px-6 py-2">
                Download Invoice
              </Button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
