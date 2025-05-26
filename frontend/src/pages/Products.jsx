import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
const Products = () => {
  const {loading, error, products} = useSelector((state)=> state.product)
  const dispatch = useDispatch();
  return (
    <>
      <PageTitle title="All Products" />
      <Navbar />
      <div className="product-layout flex items-start gap-5 p-5 mt-[100PX]">
        <div className="filter-section flex-none basis-[250px] w-[250px] bg-zinc-100 p-5 rounded-lg shadow-md">
          <h3 className="filter-heading text-lg font-semibold mb-[10px]">CATEGORIES</h3>
        </div>

        <div className="product section flex-1 ">
             <div className="product-product-container">
                  {
                     products.map()
                  }
             </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Products;
