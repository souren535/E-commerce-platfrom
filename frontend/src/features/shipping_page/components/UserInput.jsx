import React  from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const UserInput = ({
  address,
  setAddress,
  pincode,
  setPincode,
  phoneNumber,
  setPhoneNumber,
  validation,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mt-3 p-4">
        <Label htmlFor="address" className="text-xl mb-2">
          Address
        </Label>
        <Input
          className="py-5.5 placeholder:text-zinc-400 border-1 border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-white bg-zinc-800  [&:-webkit-autofill]:bg-zinc-700 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_rgb(63_63_70)_inset]"
          placeholder="Enter your address"
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="flex flex-col mt-3 p-4">
        <Label htmlFor="pinCode" className="text-xl mb-2">
          Pincode
        </Label>
        <Input
          type="number"
          id="pincode"
          name="pincode"
          className="py-5.5 placeholder:text-zinc-400 border-1 border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-white bg-zinc-800  [&:-webkit-autofill]:bg-zinc-700 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_rgb(63_63_70)_inset]"
          placeholder="Enter your pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <Label htmlFor="phoneNumber" className="text-xl mt-10 mb-2">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          className="py-5.5 placeholder:text-zinc-400 border-1 border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 text-white bg-zinc-800  [&:-webkit-autofill]:bg-zinc-700 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_rgb(63_63_70)_inset]"
          placeholder="Enter your Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <span className="text-red-300 text-sm mt-2">{validation.length}</span>
      </div>
    </div>
  );
};

export default UserInput;
