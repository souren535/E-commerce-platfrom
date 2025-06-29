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
    <div className="py-10 px-4 sm:px-6 md:px-10 w-full overflow-x-auto">
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 min-w-[300px]">
        {steps.map((step, index) => {
          const isComplete = activePath >= index;
          const iconColor = isComplete ? "#22c55e" : "#d4d4d8";
          const IconComponent = step.icon;

          return (
            <React.Fragment key={index}>
              {/* Step Item */}
              <div className="flex flex-col items-center text-center shrink-0">
                <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] bg-zinc-800 rounded-full flex items-center justify-center">
                  <IconComponent
                    style={{ fontSize: "34px", color: iconColor }}
                  />
                </div>
                <p className="text-xs sm:text-sm md:text-base text-white mt-2">
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`h-[3px] sm:h-[4px] rounded-full transition-all duration-300 ${
                    activePath >= index + 1
                      ? "bg-green-500"
                      : "bg-zinc-500"
                  } w-10 sm:w-16 md:w-20`}
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
