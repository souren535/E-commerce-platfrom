import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const UserInput = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mt-3 p-4">
        <Label htmlFor="address" className="text-xl mb-2">
          Address
        </Label>
        <Input
          className="py-5 placeholder:text-zinc-400 border-1 border-zinc-600 focus:outline-none"
          placeholder="Enter your address"
          type="text"
          id="address"
          name="address"
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
          className="py-5 placeholder:text-zinc-400 border-1 border-zinc-600 focus:outline-none"
          placeholder="Enter your pincode"
        />
        <Label htmlFor="phoneNumber" className="text-xl mt-10 mb-2">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          className="py-5 placeholder:text-zinc-400 border-1 border-zinc-600 focus:outline-none"
          placeholder="Enter your Phone number"
        />
      </div>
    </div>
  );
};

export default UserInput;
