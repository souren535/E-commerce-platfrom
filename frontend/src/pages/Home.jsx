import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";

const Home = () => {
  return (
    <>
      <Navbar />
      <ImageSlider />
      <div className=" flex justify-center w-full p-15 mb-7">
        <h2 className="text-6xl">Trending Now</h2>
        <div>
          <Product />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
