import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  const [rating, setRating] = useState(0);
  const handelRatingChange = (newRating) => {
    setRating(rating);
    console.lognewRating(`Rating change to : ${newRating}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      whileHover={{ scale: 1.08 }}
      className="flex flex-col text-center w-full bg-white md:w-[250px] lg:w-[280px] sm:w-[200px] shadow-md rounded-b-md"
    >
      <img
        src={product.image[0].url}
        alt={product.name}
        className="w-[100%] h-[100%]  object-contain rounded-tl-[8px] rounded-tr-[8px] max-h-[200px]"
      />
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className=" text-base sm:text-mb font-semibold mb-1 ">
          {product.name}
        </h3>
        <p className="text-center">
          <strong>price: </strong>
          {product.price}/-
        </p>
        <div className="flex justify-center items-center">
          <Rating
            value={product.ratings}
            onChangeRating={handelRatingChange}
            disabled={true}
          />
        </div>
        <span className="bg-zinc-400 shadow-md p-1 text-white rounded-md text-base">
          {product.numOfReviews}{" "}
          {product.numOfReviews === 1 ? "Reviews" : "Review"}
        </span>
        <button className="w-full bg-yellow-300 rounded-lg shadow-sm hover:bg-yellow-400 transition mt-2 ">
          <Link to={`/list/${product._id}`}>Check Out</Link>
        </button>
      </div>
    </motion.div>
  );
};

export default Product;
