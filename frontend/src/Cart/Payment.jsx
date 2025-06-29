import React from "react";
import PageTitle from "../components/PageTitle";
import CheckoutPath from "../features/shipping_page/components/CheckoutPath";

const Payment = () => {
  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
  return (
    <>
      <PageTitle title="Payment Processing" />

      <div className="bg-zinc-950 w-full min-h-screen flex flex-col items-center pt-10">
        <div className="w-full max-w-6xl md:mt-6 lg:mt-6 flex justify-center items-center">
          <CheckoutPath activePath={2} />
        </div>
        <div className="bg-zinc-900 md:w-[60vw] mt-4 md:h-[60vh] sm:w-[50vw] sm:h-[60vh] lg:w-[60vw] lg:h-[70vh] rounded-2xl">
          <div className="w-full h-full flex sm:flex-col">
            <span>Totla Amount</span>
            <h1 className="text-7xl">{orderItem.total}</h1>
            <div className="bg-amber-400 w-1/2 h-1/2"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
