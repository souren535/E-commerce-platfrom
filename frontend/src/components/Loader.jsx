import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/animations/loader.json";

const Loader = () => {
  return (
    <div
      className="fixed top-0 left-0 w-screen flex justify-center items-center bg-zinc-950 z-50"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
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
