import React from "react";
import Footer from "@/components/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import Lottie from "lottie-react";
import addressAnimation from "@/assets/animations/Address.json";
const ShippingPage = () => {
  return (
    <>
      <div className="text-center bg-zinc-800 flex justify-center items-center w-full h-screen">
        <div className="w-[70vw] h-[70vh] bg-zinc-700 grid grid-cols-2 border-2 border-zinc-700 rounded-4xl">
          <div className="text-white justify-center flex flex-col items-center w-wull">
            <h2 className="text-5xl font-semibold uppercase">
              Shipping Details
            </h2>
            <div className="mt-10 w-3/4 flex flex-wrap ">
              <div className="flex flex-col">
                <div className="flex flex-col mt-3 p-4">
                  <Label htmlFor="address" className="text-xl">
                    Address
                  </Label>
                  <Input
                    className="py-5 placeholder:text-white"
                    placeholder="Enter your address"
                    type="text"
                    id="address"
                    name="address"
                  />
                </div>
                <div className="flex flex-col mt-3 p-4">
                  <Label htmlFor="pinCode" className="text-xl">
                    Pincode
                  </Label>
                  <Input
                    type="number"
                    id="pincode"
                    name="pincode"
                    className="py-5 placeholder:text-white"
                    placeholder="Enter your pincode"
                  />
                  <Label htmlFor="phoneNumber" className="text-xl mt-10">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    className="py-5 placeholder:text-white"
                    placeholder="Enter your Phone number"
                  />
                </div>
              </div>
              <div className="country_group flex flex-col  text-white ">
                {/* country */}
                <Label htmlFor="country" className="text-xl">
                  Country
                </Label>
                <Select>
                  <SelectTrigger className="w-[300px] p-5 placeholder:text-white">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800">
                    <SelectGroup>
                      <SelectItem>India</SelectItem>
                      <SelectItem>US</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className={`w-3/4 p-5 bg-zinc-500 rounded-xl hover:bg-zinc-800`}
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
