import React, { useState, useEffect } from "react";
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
  const [validation, setValidation] = useState({
    length: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let errors = {
      length: "",
      address: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    };
    if (!address) {
      errors.address = "Address is required";
      valid = false;
    }
    if (!pincode) {
      errors.pincode = "Pincode is required";
      valid = false;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      errors.length = !phoneNumber
        ? "Phone number is required"
        : "Invalid phone number! it should be 10 digits";
      valid = false;
    }
    if (!selectedCountry) {
      errors.country = "Country is required";
      valid = false;
    }
    if (!selectedState) {
      errors.state = "State is required";
      valid = false;
    }
    if (!selectedCity) {
      errors.city = "City is required";
      valid = false;
    }
    setValidation(errors);
    if (!valid) return;
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
    if (
      validation.length ||
      validation.address ||
      validation.pincode ||
      validation.country ||
      validation.state ||
      validation.city
    ) {
      const timer = setTimeout(() => {
        setValidation({
          length: "",
          address: "",
          pincode: "",
          country: "",
          state: "",
          city: "",
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validation]);

  return (
    <>
      <PageTitle title={"Shipping Details"} />
      <div className="text-center bg-zinc-950 flex flex-col justify-center items-center w-full min-h-screen p-2">
        <div className="w-full max-w-4xl flex items-center mt-10 mb-6 md:mb-8 justify-center mx-auto">
          <CheckoutPath activePath={0} />
        </div>
        <div
          className="
          w-full max-w-4xl bg-zinc-900 border-2 pt-7 pb-7 border-zinc-700 rounded-3xl
          grid grid-cols-1 md:grid-cols-2 
          min-h-[70vh] gap-0 md:gap-4
          shadow-xl
        "
        >
          {/* Left Side: Form */}
          <form
            className="flex items-center justify-center w-full h-full py-8 md:py-0"
            onSubmit={handleSubmit}
          >
            <div className="text-white flex flex-col items-center w-full max-w-md mx-auto px-2 sm:px-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold uppercase text-center">
                Shipping Details
              </h2>
              <div className="mt-6 md:mt-10 w-full flex flex-col gap-3">
                <UserInput
                  address={address}
                  setAddress={setAddress}
                  pincode={pincode}
                  setPincode={setPincode}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  validation={validation}
                />
                <CountrySelector
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  validation={validation}
                />
              </div>
              <Button
                type="submit"
                className="w-full p-4 md:w-3/4 md:p-5 mt-4 bg-zinc-700 rounded-xl hover:bg-zinc-800 transition"
              >
                Continue
              </Button>
            </div>
          </form>
          {/* Right Side: Animation */}
          <div className="hidden md:flex w-full justify-center items-center p-6">
            <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
              <Lottie animationData={addressAnimation} loop={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPage;
