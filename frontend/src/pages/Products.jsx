import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeErrors } from "../features/products/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useLocation } from "react-router-dom";

const Products = () => {
  const { loading, error, products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);
  const keyword = searchparams.get("keyword");
  console.log("Keyword:", keyword);

  useEffect(() => {
    dispatch(getProduct({ keyword }));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
    dispatch(removeErrors());
  }, [dispatch, error]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title="All Products" />
      <div className="product min-h-screen flex flex-col">
        <main className="flex-grow">
          <Navbar />
          <div className="product-layout flex items-start gap-5 p-5 mt-[100PX]">
            <div className="filter-section flex-none basis-[250px] w-[250px] bg-zinc-100 p-5 rounded-lg shadow-md">
              <h3 className="filter-heading text-lg font-semibold mb-[10px]">
                CATEGORIES
              </h3>
            </div>

            <div className="products section flex-col gap-[1rem] flex flex-1 ">
              <div className="products-product-container flex flex-wrap gap-[1.5rem] justify-center">
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Products;
