/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Product from "../components/Product";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { toast } from "sonner";

const Home = () => {
  const { loading, error, products, productCount } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct({}));
  }, [dispatch]);

  useEffect(() => {
    if (error)
      toast.error(error.message, { position: "top-left", autoClose: 5000 });
    dispatch(removeErrors());
  }, [dispatch, error]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Home - My Website"} />
          <div className="home min-h-screen bg-zinc-950 flex flex-col">
            <main className="flex-grow">
              <ImageSlider />
              <div className=" flex items-center w-full p-[2rem] flex-col mt-3 justify-around">
                <h2 className="text-[2.5rem] text-zinc-50 font-semibold mb-3 text-shadow-2xs text-center">
                  Trending Now
                </h2>
                <div className="grid gap-6 sm:gap-8 md:gap-10 mt-8 pb-8 px-2 sm:px-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
                  {products.map((product, index) => (
                    <Product key={index} product={product} />
                  ))}
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
