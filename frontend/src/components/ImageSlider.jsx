/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

const ImageSlider = () => {
  const images = [
    "./images/banner1.png",
    "./images/banner2.png",
    "./images/banner3.png",
    "./images/banner4.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full relative h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden pt-[100px]">
      {/* Slide Track */}
      <div
        ref={slideRef}
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="min-w-full h-full flex justify-center items-center"
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="object-contain max-h-full max-w-full"
            />
          </div>
        ))}
      </div>

      {/* prev & next Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="relative justify-center bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 sm:w-2 sm:h-2 rounded-full cursor-pointer overflow-hidden ${
              index === currentIndex ? "bg-zinc-900" : "bg-zinc-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
