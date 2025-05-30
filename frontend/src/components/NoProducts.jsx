import React from "react";

const NoProducts = ({ keyword }) => {
  return (
    <div className="no-product-content flex flex-col p-8 text-center items-center justify-center h-[400px]">
      <div className="no-product-icon text-7xl text-[#666] mb-4">
         ⚠️
      </div>
      <h3 className="no-product-title text-3xl font-semibold text-[#333] mb-2">
        NO Product Found
      </h3>
      <p className="no-product-message text-[#666] max-w-[400px]">
        {keyword
          ? `We couldn't find any products matching "${keyword}". try using different keywords or browse our complete catalog.`
          : "No products are avilable. please check back later"}
      </p>
    </div>
  );
};

export default NoProducts;
