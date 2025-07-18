import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/animations/loader.json";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-zinc-950 w-full min-h-screen z-50">
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
