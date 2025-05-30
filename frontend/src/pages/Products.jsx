import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeErrors } from "../features/products/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";

const Products = () => {
  // eslint-disable-next-line no-unused-vars
  const { loading, error, products, resultPerPage, productCount } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchparams = new URLSearchParams(location.search);
  const keyword = searchparams.get("keyword");
  const category = searchparams.get("category");
  const pageFromURL = parseInt(searchparams.get("page"), 10) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const categories = ["Laptop", "Mobile", "Tablet", "Watches", "Monitor", "TV"];

  const handleCategoryClick = (cat) => {
    const newSearchparams = new URLSearchParams(location.search);
    newSearchparams.set("category", cat);
    newSearchparams.delete("page");
    navigate(`?${newSearchparams.toString()}`);
  };

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }));
  }, [dispatch, keyword, currentPage, category]);

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

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchparams = new URLSearchParams(location.search);

      if (page === 1) {
        newSearchparams.delete(page);
      } else {
        newSearchparams.set("page", page);
      }
      navigate(`?${newSearchparams.toString()}`);
    }
  };

  return (
    <>
      <PageTitle title="All Products" />
      {loading ? (
        <Loader />
      ) : (
        <div className="product min-h-screen flex flex-col">
          <main className="flex-grow">
            <Navbar />
            <div className="product-layout flex items-start gap-5 p-5 mt-[100PX]">
              <div className="filter-section w-[250px] flex-none  bg-zinc-100 p-5 rounded-lg shadow-md">
                <h3 className="filter-heading text-lg font-semibold mb-2 text-primary-800">
                  CATEGORIES
                </h3>
                <ul className="list-style-none p-0 m-0">
                  {categories.map((cat) => {
                    return (
                      <li
                        className=" my-[10px] rounded p-[8px] text-base cursor-pointer capitalize font-normal transition-colors duration-300 hover:bg-zinc-300"
                        key={cat}
                        onClick={() => {
                          handleCategoryClick(cat);
                        }}
                      >
                        {cat}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="products section flex-1 flex flex-col gap-6  ">
                {products.length > 0 ? (
                  <div className="products-product-container grid grid-cols-5 gap-5 ">
                    {products.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <NoProducts keyword={keyword} />
                )}
                <Pagination
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Products;
