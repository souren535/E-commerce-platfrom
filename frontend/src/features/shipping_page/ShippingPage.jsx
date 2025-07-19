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
  const [validation, setValidation] = useState({ length: "", address: "", pincode: "", country: "", state: "", city: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let errors = { length: "", address: "", pincode: "", country: "", state: "", city: "" };
    if (!address) {
      errors.address = "Address is required";
      valid = false;
    }
    if (!pincode) {
      errors.pincode = "Pincode is required";
      valid = false;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      errors.length = !phoneNumber ? "Phone number is required" : "Invalid phone number! it should be 10 digits";
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
        setValidation({ length: "", address: "", pincode: "", country: "", state: "", city: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validation]);

  return (
    <>
     <PageTitle title={'Shipping Details'}/>
      <div className="text-center bg-zinc-900 flex flex-col justify-center items-center w-full min-h-screen p-2">
        <div className="w-full max-w-4xl flex items-center mb-8 justify-center mx-auto">
          <CheckoutPath activePath={0} />
        </div>
        <div className="w-full max-w-4xl bg-zinc-800 grid grid-cols-1 md:grid-cols-2 border-2 border-zinc-700 rounded-4xl min-h-[70vh]">
          <form
            className="flex items-center justify-center w-full h-full"
            onSubmit={handleSubmit}
          >
            <div className="text-white justify-center flex flex-col items-center w-full">
              <h2 className="text-3xl md:text-5xl font-semibold uppercase text-center">
                Shipping Details
              </h2>
              <div className="mt-6 md:mt-10 w-full md:w-3/4 flex flex-col md:flex-row flex-wrap gap-3 justify-center">
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
                <div className="w-full md:w-auto">
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
              </div>
              <Button
                type="submit"
                className={`w-full md:w-3/4 p-4 md:p-5 mt-3 bg-zinc-700 rounded-xl hover:bg-zinc-800 hoverz:border-1`}
              >
                Continue
              </Button>
            </div>
          </form>
          {/* right side col */}
          <div className="hidden md:flex w-full justify-center items-center">
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
