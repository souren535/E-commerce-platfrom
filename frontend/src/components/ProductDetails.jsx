import React, { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createProductReview,
  getProductdetails,
  removeErrors,
  removeSuccess,
} from "../features/products/productSlice";
import { toast } from "sonner";
import Loader from "./Loader";
import { addItemsToCart, removeMessage } from "../features/Cart/cartSlice";

const ProductDetails = () => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { loading, error, product, reviewLoading, reviewSuccess } = useSelector(
    (state) => state.product
  );

  const {
    loading: cartLoading,
    error: cartError,
    success,
    message,
    cartItems,
  } = useSelector((state) => state.cart);
  console.log(cartItems);
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

  const handleAddToCart = () => {
    dispatch(addItemsToCart({ id, quantity }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userRating) {
      toast.error("Please select a rating");
      return;
    }
    dispatch(
      createProductReview({ rating: userRating, comment, productId: id })
    );
  };

  const handelRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review posted successfully");
      dispatch(removeSuccess());
      setComment("");
      dispatch(getProductdetails(id));
    }
  }, [reviewSuccess, dispatch, id]);

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={`${product.name} - details`} />
          <div className="product-details p-[100px] max-sm:w-[80%] bg-zinc-950 max-sm:mx-auto">
            <div className="product-detail max-w-[1200px] mx-auto flex md:flex-row text-white flex-col justify-around items-stretch min-h-[600px]">
              <div className="flex items-center justify-center z-10 mb-[20px] w-[500px] max-md:static flex-1 pt-[20px]">
                <img
                  src={product.image[0].url}
                  className=" w-[100%] max-h-[ 500px] object-contain rounded-b-[8px] "
                  alt="Product Title"
                />
              </div>

              <div className="p-[20px] w-[500px] flex-1 left-4">
                <h2 className="text-5xl mb-[15px]">{product.name}</h2>
                <p className="text-left text-xl">{product.description}</p>
                <p className="text-left text-xl font-semibold">
                  {product.price} /-
                </p>
                <div className="justify-center items-center">
                  <Rating value={product.ratings} disabled={true} />
                  <span
                    className={`shadow-md p-1 text-white rounded-md ${
                      product.numOfReview > 0 && "font-semibold"
                    } text-base`}
                  >
                    {product.numOfReview}
                    {product.numOfReviews === 0 ? "No Review" : "Reviews"}
                  </span>
                </div>

                <div className="text-[16px] m-[10px] text-[#007600] text-lg">
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
                        className="w-[35px] h-[35px] border-2 border-zinc-800 cursor-pointer text-[18px] hover:border-1 hover:border-zinc-600 rounded-lg bg-zinc-900"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        className="w-[50px] h-[40px] text-center rounded-md border-2 border-zinc-800 mx-[5px] text-[16px]"
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
                        className="w-[35px] h-[35px] border-2 border-zinc-800 cursor-pointer text-[18px] hover:border-1 hover:border-zinc-600 rounded-lg bg-zinc-900"
                      >
                        +
                      </button>
                    </div>
                    <button
                      disabled={cartLoading}
                      onClick={handleAddToCart}
                      className="w-full px-[20px] py-[12px] border-2 rounded-[8px] text-[16px] cursor-pointer my-[20px] text-white bg-zinc-900 border-zinc-800 transition-all duration-300 ease-in-out hover:translate-y-1"
                    >
                      {cartLoading ? "Adding to cart..." : "Add to Cart"}
                    </button>
                  </>
                )}
                <form
                  className="rounded-b-[8px] mb-[30px]"
                  onSubmit={handleReviewSubmit}
                >
                  <h3>Write a Review:</h3>
                  <Rating
                    value={0}
                    disabled={false}
                    onChangeRating={handelRatingChange}
                  />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here...."
                    className=" min-h-[100px] p-[10px] border-1 border-zinc-800 rounded-md bg-zinc-900 w-full mx-0 my-[10px] resize-y"
                  />
                  <button className="bg-zinc-900 text-white px-[20px] py-[10px] border-1 border-zinc-800 hover:text-zinc-500 rounded-lg cursor-pointer">
                    {reviewLoading ? "submitting review.." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            <div className=" reviews-container grid-cols-1/-1 mt-[40px] pt-[20px] border-t-[1px] border-solid border-zinc-800">
              <h3 className="text-2xl text-white font-medium">
                Coustomer reviews
              </h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="mt-[20px] text-white">
                  {product.reviews.map((review, index) => (
                    <div
                      className="px-0 py-[20px] border-b-[1px] border-solid border-zinc-600 text-white"
                      key={index}
                    >
                      <div className="review header text-white">
                        <Rating value={review.rating} disabled={true} />
                      </div>
                      <p className="review-comment mx-0 my-[10px] text-left">
                        {review.comment}
                      </p>
                      <p className="mx-0 my-[10px] text-left font-sans">
                        By {review.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans tracking-wider text-zinc-600">
                  No review yet. Be the first review this Product!
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
