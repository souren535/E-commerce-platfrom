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
          <div className="home min-h-screen bg-zinc-900 flex flex-col">
            <main className="flex-grow">
              <ImageSlider />
              <div className=" flex items-center w-full p-[2rem] flex-col mt-3 justify-around">
                <h2 className="text-[2.5rem] text-zinc-50 font-semibold mb-3 text-shadow-2xs text-center">
                  Trending Now
                </h2>
                <div className="grid gap-12 mt-8 pb-12 px-4 grid-cols-5 md:grid-cols-2 xl:grid-cols-5">
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
