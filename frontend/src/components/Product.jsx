import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700 text-white shadow-xl rounded-2xl overflow-hidden w-full sm:w-[250px] md:w-[260px] lg:w-[280px] flex flex-col"
    >
      {/* Product Image */}
      <div className="relative group">
        <img
          src={product.image[0]?.url}
          alt={product.name}
          className="w-full h-56 object-contain bg-zinc-950 p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col items-center text-center gap-2">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-indigo-400 font-bold text-base">₹ {product.price}</p>

        <div className="flex justify-center">
          <Rating value={product.ratings} disabled={true} />
        </div>

        <p className="text-sm text-zinc-400">
          {product.numOfReviews}{" "}
          {product.numOfReviews === 1 ? "Review" : "Reviews"}
        </p>

        <Link
          to={`/list/${product._id}`}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded-lg font-semibold shadow-sm"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default Product;
