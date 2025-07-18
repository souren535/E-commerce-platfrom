import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/animations/loader.json";

const Loader = () => {
  return (
    <div className="flex justify-center bg-zinc-950 items-center h-screen">
      <div className="w-80 h-80 text-zinc-600">
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          className="w-60 h-60"
          style={{ filter: "grayscale(1)" }}
        />
      </div>
    </div>
  );
};

export default Loader;
