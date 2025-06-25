import React, { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProductdetails,
  removeErrors,
} from "../features/products/productSlice";
import { toast } from "sonner";
import Loader from "./Loader";
import { addItemsToCart, removeMessage } from "../features/Cart/cartSlice";

const ProductDetails = () => {
  // eslint-disable-next-line no-unused-vars
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { loading, error, product } = useSelector((state) => state.product);
  const {
    loading: cartLoading,
    error: cartError,
    success,
    message,
    cartItems
  } = useSelector((state) => state.cart);
  console.log(cartItems)
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (id) dispatch(getProductdetails(id));
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) toast.error(error.message || "Somthing Went Wrong!");
    dispatch(removeErrors());
    if (cartError) toast.error(cartError || "Somthing Went Wrong!");
  }, [dispatch, error, cartError]);

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(removeMessage());
    }
  }, [success, dispatch, message]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageTitle title="product - Details" />
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    dispatch(addItemsToCart({ id, quantity }));
  };

  const handelRatingChange = (newRating) => {
    setUserRating(newRating);
  };
  return (
    <>
      <PageTitle title={`${product.name} - details`} />
      <Navbar />
      <div className="product-details p-[100px] max-sm:w-[80%] max-sm:mx-auto">
        <div className="product-detail max-w-[1200px] mx-auto flex md:flex-row flex-col justify-around items-center">
          <div className=" sticky t-[40px] z-10 mb-[20px] w-[500px] max-md:static ">
            <img
              src={product.image[0].url}
              className=" w-[100%] max-h-[ 500px] object-contain rounded-b-[8px] bg-[#fff] "
              alt="Product Title"
            />
          </div>

          <div className="p-[20px] w-[500px] ">
            <h2 className="text-[24px] mb-[15px] text-[#0F1111]">
              {product.name}
            </h2>
            <p className="text-left">{product.description}</p>
            <p className="text-left">{product.price} /-</p>
            <div className="justify-center items-center">
              <Rating value={product.ratings} disabled={true} />
              <span className="bg-zinc-400 shadow-md p-1 text-white rounded-md text-base">
                {product.numOfReview}
                {product.numOfReviews === 0 ? "No Review" : "Reviews"}
              </span>
            </div>

            <div className="text-[16px] m-[10px] text-[#007600]">
              <span
                className={
                  product.stock > 1 ? `text-green-500` : "text-red-500"
                }
              >
                {product.stock > 0
                  ? `In Stoke (${product.stock})`
                  : "Out Of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className=" quentity-container flex items-center m-[20-px] gap-[10px]">
                  <span className="font-semibold mr-[10px]">Quentity:</span>
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                    className="w-[35px] h-[35px] border-[1px] border-solid border-[#D5D9D9] cursor-pointer text-[18px] hover:border-1 hover:border-zinc-700 rounded-b-[4px] bg-gradient-to-b from-[#F7F8FA] t0-[#E7E9EC]"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    className="w-[50px] h-[35px] text-center border border-[#D5D9D9] mx-[5px] text-[16px]"
                    readOnly
                  />
                  <button
                    onClick={() => {
                      if (product.stock <= quantity) {
                        toast.error("cannot exceed available stock!");
                        dispatch(removeErrors());
                        return;
                      }
                      setQuantity((prev) => prev + 1);
                    }}
                    className="w-[35px] h-[35px] border-[1px] border-solid border-[#D5D9D9] cursor-pointer text-[18px] hover:border-1 hover:border-zinc-700 rounded-b-[4px] bg-gradient-to-b from-[#F7F8FA] t0-[#E7E9EC]"
                  >
                    +
                  </button>
                </div>
                <button
                  disabled={cartLoading}
                  onClick={handleAddToCart}
                  className="w-full px-[20px] py-[12px] border rounded-[8px] text-[16px] cursor-pointer my-[20px] text-zinc-100 bg-zinc-500 border-[var(--bg-primary)] hover:bg-zinc-700"
                >
                  {cartLoading ? "Adding to cart..." : "Add to Cart"}
                </button>
              </>
            )}
            <form className="bg-[#F8F8F8] p-[20px] rounded-b-[8px] mb-[30px]">
              <h3>Write a Review:</h3>
              <Rating
                value={0}
                disabled={false}
                onChangeRating={handelRatingChange}
              />
              <textarea
                placeholder="Write your review here...."
                className="w-[100%] min-h-[100px] p-[10px] border-[1px] border-solid border-[#D5D9D9] rounded-b-[4px] mx-0 my-[10px] resize-y"
              />
              <button className="bg-zinc-500 text-white px-[20px] py-[10px] border-none rounded-[4px] cursor-pointer hover:bg-[#374759]">
                Submit Review
              </button>
            </form>
          </div>
        </div>

        <div className=" reviews-container grid-cols-1/-1 mt-[40px] pt-[20px] border-t-[1px] border-solid border-[#E7E7E7]">
          <h3 className="text-2xl font-medium">Coustomer reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="mt-[20px]">
              {product.reviews.map((review, index) => (
                <div
                  className="px-0 py-[20px] border-b-[1px] border-solid border-[#E7E7E7]"
                  key={index}
                >
                  <div className="review header">
                    <Rating value={review.rating} disabled={true} />
                  </div>
                  <p className="review-comment mx-0 my-[10px] text-[#333] text-left">
                    {review.comment}
                  </p>
                  <p className="mx-0 my-[10px] text-[#333] text-left font-sans">
                    By {review.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans tracking-wider">
              No review yet. Be the first review this Product!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
