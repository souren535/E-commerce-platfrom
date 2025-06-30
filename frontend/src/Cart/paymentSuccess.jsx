import React from "react";
import paymentAnimation from "../assets/animations/payment_success.json";
import Lottie from "lottie-react";
import { Link, useSearchParams } from "react-router-dom";
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  return (
    <div className="w-full h-screen bg-zinc-950 flex justify-center items-center">
      <div className="w-[30vw] h-[30vh] flex flex-col justify-center items-center">
        <Lottie animationData={paymentAnimation} loop={true} />
        <div className="text-white">
          <h1 className="text-3xl text-center ">Order Confirm</h1>
          <p className="text-lg">
            Your payment was successful <strong>{reference}</strong>
          </p>
        </div>
        <Link className="px-7 py-7 bg-zinc-900 rounded-lg">
          Explore More Products
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
