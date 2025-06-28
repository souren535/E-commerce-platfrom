import React from "react";
import {
  AccountBalance,
  LibraryAddCheck,
  LocalShipping,
} from "@mui/icons-material";

const CheckoutPath = ({ activePath }) => {
  const steps = [
    {
      label: "Shipping Details",
      icon: LocalShipping,
    },
    {
      label: "Confirm Order",
      icon: LibraryAddCheck,
    },
    {
      label: "Payment",
      icon: AccountBalance,
    },
  ];

  return (
    <div className="w-full flex justify-center bg-zinc-900 py-10">
      <div className="flex items-center w-fit gap-4">
        {steps.map((step, index) => {
          const isComplete = activePath >= index;
          const iconColor = isComplete ? "#22c55e" : "#d4d4d8";
          const IconComponent = step.icon;
          return (
            <React.Fragment key={index}>
              {/* Icon + Label */}
              <div className="flex flex-col items-center ">
                <div className="w-[70px] h-[70px] bg-zinc-800 rounded-full flex items-center justify-center">
                  <IconComponent
                    style={{ fontSize: "40px", color: iconColor }}
                  />
                </div>
                <p className="text-sm text-zinc-400 mt-2">{step.label}</p>
              </div>

              {/* Line Between Steps */}
              {index !== steps.length - 1 && (
                <div
                  className={`w-[80px] h-[4px] ${
                    activePath >= index + 1 ? "bg-green-500" : "bg-zinc-400"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
    </div>
  );
};

export default CheckoutPath;
