import React, { useEffect } from "react";
import paymentAnimation from "../assets/animations/payment_success.json";
import Lottie from "lottie-react";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createOrder,
  removeError,
  removeSuccess,
} from "../features/order/orderSlice";
import { clearCart } from "../features/Cart/cartSlice";
import Loader from "../components/Loader";
import withAuthProtection from "../Security/withAuthProtection";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { success, error, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));

  useEffect(() => {
    const createOrderData = async () => {
      try {
        if (!orderItem) return;
        const orderData = {
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pincode,
            phoneNo: shippingInfo.phoneNumber,
          },
          orderItems: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: "succeeded",
          },
          itemPrice: orderItem.subTotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shipping,
          totalPrice: orderItem.total,
        };
        console.log("Sending Data", orderData);
        dispatch(createOrder(orderData));
        sessionStorage.removeItem("orderItem");
      } catch (error) {
        console.log(error);
        toast.error(error.message || "order creation error");
      }
    };

    createOrderData();
  }, []);

  useEffect(() => {
    if (success) {
      toast.success("Order placed successfully");
      dispatch(clearCart());
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  return (
    <>
      <PageTitle title={`Payment Status`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full h-screen bg-zinc-950 flex justify-center items-center px-4">
          <div className="w-full max-w-md bg-zinc-900 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg">
            <Lottie
              animationData={paymentAnimation}
              className="w-full max-w-xs"
              loop={true}
            />
            <div className="text-white text-center mt-4 space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Order Confirmed
              </h1>
              <p className="text-base md:text-lg">
                Your payment was successful <br />
                <strong>{reference}</strong>
              </p>
            </div>
            <Link
              to="/orders/user"
              className="mt-6 px-6 py-3 bg-zinc-800 text-white border-1 border-zinc-700 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-200 transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

const ProtectedPaymentSuccess = withAuthProtection(PaymentSuccess);
export default ProtectedPaymentSuccess;
