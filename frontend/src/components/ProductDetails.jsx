import React, { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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
  const [selectedImage, setSelectedImage] = useState("");
  const { loading, error, product, reviewLoading, reviewSuccess } = useSelector(
    (state) => state.product
  );

  const isAuthenticated = useSelector((state) => state.user);

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
          <div className="product-details p-4 sm:p-8 md:p-12 lg:p-[100px] bg-zinc-950 min-h-screen">
            <div className="product-detail max-w-[1500px] mx-auto flex flex-col lg:flex-row text-white justify-around items-stretch min-h-[600px] gap-8">
              {/* Product Images Section */}
              <div className="flex flex-col lg:flex-row items-center justify-center z-10 w-full lg:w-[700px] flex-1 pt-4 lg:pt-[20px]">
                {/* Thumbnail Images - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:flex h-full space-y-7 w-[200px] flex-col justify-center items-center">
                  {product.image.map((image, i) => (
                    <motion.img
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        opacity: {
                          duration: 1,
                          ease: "easeInOut",
                        },
                      }}
                      whileHover={{ scale: 1.3 }}
                      key={i}
                      src={image.url}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-[100px] h-[100px] cursor-pointer rounded-2xl"
                      onMouseEnter={() => setSelectedImage(image.url)}
                      onMouseLeave={() =>
                        setSelectedImage(product.image[0].url)
                      }
                    />
                  ))}
                </div>

                {/* Main Product Image */}
                <div className="w-full lg:w-[70%] flex flex-col items-center">
                  <img
                    src={selectedImage || product.image[0].url}
                    className="w-full max-w-[500px] max-h-[500px] object-contain rounded-3xl"
                    alt="Product Title"
                  />

                  {/* Mobile Image Gallery - Horizontal scroll */}
                  <div className="lg:hidden w-full mt-4 overflow-x-auto">
                    <div className="flex space-x-4 pb-2">
                      {product.image.map((image, i) => (
                        <img
                          key={i}
                          src={image.url}
                          alt={`Product ${i + 1}`}
                          className="w-20 h-20 rounded-lg cursor-pointer flex-shrink-0 border-2 border-zinc-800 hover:border-zinc-600 transition-colors"
                          onClick={() => setSelectedImage(image.url)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="p-4 lg:p-[20px] w-full lg:max-w-1/3 flex-1 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {product.name}
                  </h2>
                  <p className="text-sm sm:text-lg text-zinc-300 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold text-green-400">
                    ₹{product.price} /-
                  </p>

                  {/* Rating and Reviews */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Rating value={product.ratings} disabled={true} />
                    <span className="text-sm sm:text-base text-zinc-400">
                      {product.numOfReview}{" "}
                      {product.numOfReviews === 0 ? "No Review" : "Reviews"}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="text-sm sm:text-lg">
                    <span
                      className={
                        product.stock > 1 ? `text-green-500` : "text-red-500"
                      }
                    >
                      {product.stock > 0
                        ? `In Stock (${product.stock})`
                        : "Out Of Stock"}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Section */}
                {product.stock > 0 && (
                  <div className="space-y-4">
                    <div className="quantity-container flex items-center gap-3">
                      <span className="font-semibold text-sm sm:text-base">
                        Quantity:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={quantity <= 1}
                          onClick={() => setQuantity(quantity - 1)}
                          className="w-8 h-8 sm:w-[35px] sm:h-[35px] border-2 border-zinc-800 cursor-pointer text-sm sm:text-[18px] hover:border-zinc-600 rounded-lg bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          className="w-12 sm:w-[50px] h-8 sm:h-[40px] text-center rounded-md border-2 border-zinc-800 text-sm sm:text-[16px] bg-zinc-900"
                          readOnly
                        />
                        <button
                          onClick={() => {
                            if (product.stock <= quantity) {
                              toast.error("Cannot exceed available stock!");
                              dispatch(removeErrors());
                              return;
                            }
                            setQuantity((prev) => prev + 1);
                          }}
                          className="w-8 h-8 sm:w-[35px] sm:h-[35px] border-2 border-zinc-800 cursor-pointer text-sm sm:text-[18px] hover:border-zinc-600 rounded-lg bg-zinc-900"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      disabled={cartLoading}
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.message("Please login first");
                          return;
                        }
                        handleAddToCart();
                      }}
                      className="w-full px-4 sm:px-[20px] py-3 sm:py-[12px] border-2 rounded-[8px] text-sm sm:text-[16px] cursor-pointer text-white bg-zinc-900 border-zinc-800 transition-all duration-300 ease-in-out hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cartLoading ? "Adding to cart..." : "Add to Cart"}
                    </button>
                  </div>
                )}

                {/* Review Form */}
                {isAuthenticated && (
                  <form
                    className="space-y-4 rounded-b-[8px]"
                    onSubmit={handleReviewSubmit}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold">
                      Write a Review:
                    </h3>
                    <Rating
                      value={0}
                      disabled={false}
                      onChangeRating={handelRatingChange}
                    />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write your review here...."
                      className="min-h-[100px] p-3 sm:p-[10px] border border-zinc-800 rounded-md bg-zinc-900 w-full resize-y text-sm sm:text-base"
                    />
                    <button className="bg-zinc-900 text-white px-4 sm:px-[20px] py-2 sm:py-[10px] border border-zinc-800 hover:text-zinc-500 rounded-lg cursor-pointer text-sm sm:text-base transition-colors">
                      {reviewLoading ? "Submitting review..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-container mt-8 sm:mt-[40px] pt-4 sm:pt-[20px] border-t border-zinc-800">
              <h3 className="text-xl sm:text-2xl text-white font-medium mb-4 sm:mb-6">
                Customer Reviews
              </h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {product.reviews.map((review, index) => (
                    <div
                      className="p-4 sm:p-6 border-b border-zinc-600 text-white bg-zinc-900/50 rounded-lg"
                      key={index}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Rating value={review.rating} disabled={true} />
                      </div>
                      <p className="text-sm sm:text-base text-zinc-300 mb-2 leading-relaxed">
                        {review.comment}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                        By {review.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base text-zinc-600 text-center py-8">
                  No reviews yet. Be the first to review this product!
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
