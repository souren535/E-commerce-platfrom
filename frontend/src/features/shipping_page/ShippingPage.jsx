import React from "react";
import Footer from "@/components/Footer";
import Lottie from "lottie-react";
import addressAnimation from "@/assets/animations/Address.json";
import CountrySelector from "./components";
import UserInput from "./components/UserInput";
import { Button } from "@/components/ui/button";
import CheckoutPath from "./components/CheckoutPath";

const ShippingPage = () => {
  return (
    <>
      <div className="text-center bg-zinc-900 flex flex-col justify-center items-center w-full h-screen">
        <div className="w-[70vw] flex items-center mb-8 justify-center">
          <CheckoutPath activePath={0} />
        </div>
        <div className="w-[70vw] h-[70vh] bg-zinc-800 grid grid-cols-2 border-2 border-zinc-700 rounded-4xl">
          <div className="text-white justify-center flex flex-col items-center w-wull">
            <h2 className="text-5xl font-semibold uppercase">
              Shipping Details
            </h2>
            <div className="mt-10 w-3/4 flex flex-wrap gap-3 ">
              {/* left side details */}
              <UserInput />

              {/* right side details */}
              <div>
                <CountrySelector />
              </div>
            </div>
            <Button
              className={`w-3/4 p-5 bg-zinc-700 rounded-xl hover:bg-zinc-800 hoverz:border-1`}
            >
              Continue
            </Button>
          </div>

          {/* rigth side col */}
          <div className="w-wull flex justify-center items-center">
            <div className="w-3/4">
              <Lottie animationData={addressAnimation} loop={true} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingPage;
