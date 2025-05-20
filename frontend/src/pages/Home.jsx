import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className=" flex justify-center w-full p-15 mb-7">
        <h2 className="text-6xl">Trending Now</h2>
      </div>
      <Footer />
    </>
  );
};

export default Home;
