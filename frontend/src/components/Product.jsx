import React from "react";

const Product = () => {
  return (
    <div className="flex flex-col w-[250px] shadow-md rounded-b-md ">
      <img />
      <div className="p-[1rem]  ">
        <h3 className="text-[1rem] font-semibold mb-1 ">Product1</h3>
        <p className="text-center">
          <strong>price</strong>500/-
        </p>
        <button className="w-full bg-yellow-300 rounded-lg shadow-sm  mt-2 ">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Product;
