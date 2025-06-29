import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Lottie from "lottie-react";
import addressAnimation from "@/assets/animations/Address.json";
import CountrySelector from "./components";
import UserInput from "./components/UserInput";
import { Button } from "@/components/ui/button";
import CheckoutPath from "./components/CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../Cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageTitle from "../../components/PageTitle";

const ShippingPage = () => {
  const { shippingInfo } = useSelector((state) => state.cart);
  console.log("Shipping details", shippingInfo);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(shippingInfo.address || "");
  const [pincode, setPincode] = useState(shippingInfo.pincode || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingInfo.phoneNumber || ""
  );
  const [selectedCountry, setSelectedCountry] = useState(
    shippingInfo.country || ""
  );
  const [selectedState, setSelectedState] = useState(shippingInfo.state || "");
  const [selectedCity, setSelectedCity] = useState(shippingInfo.city || "");
  const [validation, setValidation] = useState({ lengths: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setValidation((prev) => ({
        ...prev,
        length: "Invalid phone number! it should be 10 digits",
      }));
      return;
    }
    dispatch(
      saveShippingInfo({
        address,
        pincode,
        phoneNumber,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      })
    );
    setAddress("");
    setPincode("");
    setPhoneNumber("");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    toast.success("Your shipping details now save! Now confirm your order");
    navigate("/order/confirm");
  };

  useEffect(() => {
    if (validation.length) {
      const timer = setTimeout(() => {
        setValidation((prev) => ({
          ...prev,
          length: "",
        }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [validation.length]);

  return (
    <>
     <PageTitle title={'Shipping Details'}/>
      <div className="text-center bg-zinc-900 flex flex-col justify-center items-center w-full h-screen">
        <div className="w-[70vw] flex items-center mb-8 justify-center">
          <CheckoutPath activePath={0} />
        </div>
        <div className="w-[70vw] h-[70vh] bg-zinc-800 grid grid-cols-2 border-2 border-zinc-700 rounded-4xl">
          <form
            className="flex items-center justify-center w-full h-full"
            onSubmit={handleSubmit}
          >
            <div className="text-white justify-center flex flex-col items-center w-full">
              <h2 className="text-5xl font-semibold uppercase">
                Shipping Details
              </h2>
              <div className="mt-10 w-3/4 flex flex-wrap gap-3 justify-center">
                {/* left side details */}
                <UserInput
                  address={address}
                  setAddress={setAddress}
                  pincode={pincode}
                  setPincode={setPincode}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  validation={validation}
                />

                {/* right side details */}
                <div>
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className={`w-3/4 p-5 mt-3 bg-zinc-700 rounded-xl hover:bg-zinc-800 hoverz:border-1`}
              >
                Continue
              </Button>
            </div>
          </form>

          {/* rigth side col */}
          <div className="w-full flex justify-center items-center">
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
